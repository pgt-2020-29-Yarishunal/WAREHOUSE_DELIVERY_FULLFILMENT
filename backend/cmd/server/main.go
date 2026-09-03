package main

import (
	"backend/config"
	"backend/internal/modules/auth"
	"backend/internal/modules/dashboard"
	"backend/internal/modules/order_ppc"
	"backend/internal/modules/warehouse"
	"backend/internal/routes"
	"fmt"
	"log"
	"net/http"
)

func main() {
	// 1. Load configuration
	cfg := config.LoadConfig()

	// 2. Initialize Database and run migration
	db, err := config.InitDB(cfg)
	if err != nil {
		log.Fatalf("❌ Gagal inisialisasi database: %v", err)
	}

	if err := config.MigrateDB(db, &warehouse.Warehouse{}, &auth.User{}, &order_ppc.OrderPPCWH{}); err != nil {
		log.Fatalf("❌ Gagal migrasi database: %v", err)
	}

	// 3. Initialize Modular Layers (Vertical Slices)
	// Warehouse Module
	whRepo := warehouse.NewRepository(db)
	whService := warehouse.NewService(whRepo)
	whHandler := warehouse.NewHandler(whService)

	// Auth Module
	authRepo := auth.NewRepository(db)
	authService := auth.NewService(authRepo, cfg.JWTSecret, cfg.JWTExpiresIn)
	authHandler := auth.NewHandler(authService)

	// Order PPC Module
	orderRepo := order_ppc.NewRepository(db)
	orderService := order_ppc.NewService(orderRepo)
	orderHandler := order_ppc.NewHandler(orderService)

	// Dashboard Module
	dashboardRepo := dashboard.NewRepository(db)
	dashboardService := dashboard.NewService(dashboardRepo)
	dashboardHandler := dashboard.NewHandler(dashboardService)

	// 4. Setup Router & Routes
	router := routes.SetupRouter(cfg, &routes.Handlers{
		Auth:      authHandler,
		Warehouse: whHandler,
		OrderPPC:  orderHandler,
		Dashboard: dashboardHandler,
	})

	// 5. Start HTTP Server
	serverAddr := ":" + cfg.Port
	fmt.Println("==================================================================")
	fmt.Println("🚀 PT GAJAH TUNGGAL TBK — DELIVERY & WAREHOUSE BACKEND API")
	fmt.Printf("   Architecture: Package-by-Feature (Vertical Slice)\n")
	fmt.Printf("   Listening on: http://localhost:%s\n", cfg.Port)
	fmt.Printf("   API Base URL: http://localhost:%s%s\n", cfg.Port, cfg.APIPrefix)
	fmt.Printf("   Auth Endpoint: POST http://localhost:%s%s/auth/login\n", cfg.Port, cfg.APIPrefix)
	fmt.Printf("   Warehouses   : GET  http://localhost:%s%s/warehouses\n", cfg.Port, cfg.APIPrefix)
	fmt.Printf("   Orders PPC   : GET  http://localhost:%s%s/orders\n", cfg.Port, cfg.APIPrefix)
	fmt.Println("==================================================================")

	if err := http.ListenAndServe(serverAddr, router); err != nil {
		log.Fatalf("❌ Server error: %v", err)
	}
}
