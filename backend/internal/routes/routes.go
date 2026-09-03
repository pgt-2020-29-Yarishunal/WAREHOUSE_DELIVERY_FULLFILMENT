package routes

import (
	"backend/config"
	"backend/internal/middleware"
	"backend/internal/modules/auth"
	"backend/internal/modules/dashboard"
	"backend/internal/modules/order_ppc"
	"backend/internal/modules/warehouse"
	"backend/internal/pkg/response"
	"net/http"
)

type Handlers struct {
	Auth      *auth.Handler
	Warehouse *warehouse.Handler
	OrderPPC  *order_ppc.Handler
	Dashboard *dashboard.Handler
}

func SetupRouter(cfg *config.Config, h *Handlers) http.Handler {
	mux := http.NewServeMux()

	// 1. Health Check
	mux.HandleFunc(cfg.APIPrefix+"/health", func(w http.ResponseWriter, r *http.Request) {
		response.JSONSuccess(w, "Delivery Dashboard Gudang Backend API is Healthy", map[string]string{
			"status":      "online",
			"environment": cfg.Environment,
			"version":     "v1.0.0",
		})
	})

	// 2. Auth Module Routes
	mux.HandleFunc(cfg.APIPrefix+"/auth/login", h.Auth.Login)
	mux.HandleFunc(cfg.APIPrefix+"/auth/presets", h.Auth.GetPresets)
	mux.HandleFunc(cfg.APIPrefix+"/auth/logout", h.Auth.Logout)

	// Protected Auth Routes
	protectedMe := middleware.AuthMiddleware(cfg)(http.HandlerFunc(h.Auth.GetMe))
	mux.Handle(cfg.APIPrefix+"/auth/me", protectedMe)

	// 3. Warehouse Module Routes
	mux.HandleFunc(cfg.APIPrefix+"/warehouses", h.Warehouse.GetAll)
	mux.HandleFunc(cfg.APIPrefix+"/warehouses/", h.Warehouse.GetByID)

	// 4. Order PPC Module Routes (Protected with Auth)
	protectedOrders := middleware.AuthMiddleware(cfg)(http.HandlerFunc(h.OrderPPC.GetOrders))
	mux.Handle(cfg.APIPrefix+"/orders", protectedOrders)

	// 5. Dashboard Module Routes (Protected with Auth)
	authMW := middleware.AuthMiddleware(cfg)
	mux.Handle(cfg.APIPrefix+"/dashboard/filters", authMW(http.HandlerFunc(h.Dashboard.GetFilters)))
	mux.Handle(cfg.APIPrefix+"/dashboard/topbar", authMW(http.HandlerFunc(h.Dashboard.GetTopBar)))
	mux.Handle(cfg.APIPrefix+"/dashboard/so-status", authMW(http.HandlerFunc(h.Dashboard.GetSOStatus)))
	mux.Handle(cfg.APIPrefix+"/dashboard/actual-vs-supply", authMW(http.HandlerFunc(h.Dashboard.GetActualVsSupply)))
	mux.Handle(cfg.APIPrefix+"/dashboard/area-achievement", authMW(http.HandlerFunc(h.Dashboard.GetAreaAchievement)))
	mux.Handle(cfg.APIPrefix+"/dashboard/spatial-map", authMW(http.HandlerFunc(h.Dashboard.GetSpatialMap)))
	mux.Handle(cfg.APIPrefix+"/dashboard/bottleneck-skus", authMW(http.HandlerFunc(h.Dashboard.GetBottleneckSKUs)))
	mux.Handle(cfg.APIPrefix+"/dashboard/warehouse-so", authMW(http.HandlerFunc(h.Dashboard.GetWarehouseSO)))
	mux.Handle(cfg.APIPrefix+"/dashboard/daily-truck-plan", authMW(http.HandlerFunc(h.Dashboard.GetDailyTruckPlan)))
	mux.Handle(cfg.APIPrefix+"/dashboard/province-trucks", authMW(http.HandlerFunc(h.Dashboard.GetProvinceTrucks)))
	mux.Handle(cfg.APIPrefix+"/dashboard/rep-preview", authMW(http.HandlerFunc(h.Dashboard.GetRepSOPreview)))

	// Apply Global CORS Middleware
	return middleware.CORSMiddleware(mux)
}
