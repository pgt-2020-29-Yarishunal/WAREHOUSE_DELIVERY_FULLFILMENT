package order_ppc

import (
	"backend/internal/middleware"
	"backend/internal/pkg/response"
	"net/http"
	"strconv"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

// GetOrders handles GET /api/v1/orders (Query: warehouse_id, page, page_size)
func (h *Handler) GetOrders(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		response.JSONError(w, http.StatusMethodNotAllowed, "Metode HTTP tidak diizinkan")
		return
	}

	query := r.URL.Query()
	whID := query.Get("warehouse_id")

	// If warehouse_id not in query, check logged in user claims
	if whID == "" {
		if claims, ok := middleware.GetUserFromContext(r.Context()); ok && claims.WarehouseID != nil {
			whID = *claims.WarehouseID
		}
	}

	page, _ := strconv.Atoi(query.Get("page"))
	if page < 1 {
		page = 1
	}
	pageSize, _ := strconv.Atoi(query.Get("page_size"))
	if pageSize < 1 {
		pageSize = 50
	}

	if whID != "" {
		orders, total, err := h.service.GetOrdersByWarehouse(whID, page, pageSize)
		if err != nil {
			response.JSONError(w, http.StatusInternalServerError, "Gagal memuat data transaksi: "+err.Error())
			return
		}
		response.JSONSuccess(w, "Data transaksi PPC gudang berhasil dimuat", map[string]interface{}{
			"warehouse_id": whID,
			"page":         page,
			"page_size":    pageSize,
			"total":        total,
			"orders":       orders,
		})
		return
	}

	// If no warehouse specified (e.g. executive)
	orders, total, err := h.service.GetAllOrders(page, pageSize)
	if err != nil {
		response.JSONError(w, http.StatusInternalServerError, "Gagal memuat data transaksi: "+err.Error())
		return
	}

	response.JSONSuccess(w, "Data transaksi PPC seluruh gudang berhasil dimuat", map[string]interface{}{
		"page":      page,
		"page_size": pageSize,
		"total":     total,
		"orders":    orders,
	})
}
