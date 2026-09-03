package main

import (
	"backend/config"
	"backend/internal/modules/auth"
	"backend/internal/modules/order_ppc"
	"backend/internal/modules/warehouse"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"time"
)

func main() {
	start := time.Now()
	fmt.Println("==================================================================")
	fmt.Println("🚀 SEEDER DELIVERY DASHBOARD GUDANG (PACKAGE-BY-FEATURE)")
	fmt.Println("   PT Gajah Tunggal Tbk")
	fmt.Println("==================================================================")

	// 1. Load configuration
	cfg := config.LoadConfig()

	// 2. Initialize Database
	db, err := config.InitDB(cfg)
	if err != nil {
		log.Fatalf("❌ Gagal inisialisasi database: %v", err)
	}

	// 3. Drop existing tables for fresh schema setup and run migration
	_ = db.Migrator().DropTable(&order_ppc.OrderPPCWH{}, &auth.User{}, &warehouse.Warehouse{})
	if err := config.MigrateDB(db, &warehouse.Warehouse{}, &auth.User{}, &order_ppc.OrderPPCWH{}); err != nil {
		log.Fatalf("❌ Gagal migrasi database: %v", err)
	}

	// 4. Seed Warehouses Module
	if err := warehouse.Seed(db); err != nil {
		log.Fatalf("❌ Gagal seeding warehouses: %v", err)
	}

	// 5. Seed Auth/Users Module
	if err := auth.Seed(db); err != nil {
		log.Fatalf("❌ Gagal seeding users: %v", err)
	}

	// 6. Find and Seed Order PPC Module (data SO.csv)
	candidates := []string{
		filepath.Join("..", "data SO.csv"),
		"data SO.csv",
		filepath.Join("..", "..", "data SO.csv"),
		filepath.Join("..", "data SO tanpa radial.csv"),
	}
	csvPath := ""
	for _, p := range candidates {
		if _, err := os.Stat(p); err == nil {
			csvPath = p
			break
		}
	}

	if csvPath == "" {
		log.Printf("⚠️ File 'data SO.csv' tidak ditemukan pada path pencarian standar.")
	} else {
		fmt.Printf("\n📂 Membaca dan men-seeding file CSV: %s\n", csvPath)
		db.Exec("DELETE FROM order_ppc_wh")

		stats, err := order_ppc.Seed(db, csvPath)
		if err != nil {
			log.Fatalf("❌ Gagal seeding data SO: %v", err)
		}

		fmt.Println("\n📈 HASIL SEEDING TRANSAKSI ORDER PPC WH PER GUDANG:")
		fmt.Printf("   • APW (Bias Warehouse)   : %d transaksi\n", stats["APW"])
		fmt.Printf("   • BPW (Motor Warehouse)  : %d transaksi\n", stats["BPW"])
		fmt.Printf("   • DPW (Radial Warehouse) : %d transaksi\n", stats["DPW"])
		fmt.Printf("   • RPW (TBR Warehouse)    : %d transaksi\n", stats["RPW"])
		fmt.Printf("   • Total Seluruh Baris    : %d baris\n", stats["TOTAL_ROWS"])
	}

	// 7. Verification Counts
	var countWarehouses, countUsers, countOrders int64
	db.Model(&warehouse.Warehouse{}).Count(&countWarehouses)
	db.Model(&auth.User{}).Count(&countUsers)
	db.Model(&order_ppc.OrderPPCWH{}).Count(&countOrders)

	fmt.Println("\n✅ STATUS TABEL DATABASE SETELAH SEEDING:")
	fmt.Printf("   • Tabel 'warehouses'   : %d baris\n", countWarehouses)
	fmt.Printf("   • Tabel 'users'        : %d baris\n", countUsers)
	fmt.Printf("   • Tabel 'order_ppc_wh' : %d baris\n", countOrders)
	fmt.Printf("\n⏱️ Waktu eksekusi: %v\n", time.Since(start))
	fmt.Println("✨ SEEDER BERHASIL SELESAI DENGAN SEMPURNA!")
	fmt.Println("==================================================================")
}
