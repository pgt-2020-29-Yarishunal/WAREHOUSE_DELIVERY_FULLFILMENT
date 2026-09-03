package warehouse

import (
	"backend/internal/pkg/response"
	"net/http"
	"strings"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

// GetAll handles GET /api/v1/warehouses
func (h *Handler) GetAll(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		response.JSONError(w, http.StatusMethodNotAllowed, "Metode HTTP tidak diizinkan")
		return
	}

	warehouses, err := h.service.GetAllWarehouses()
	if err != nil {
		response.JSONError(w, http.StatusInternalServerError, "Gagal memuat data gudang: "+err.Error())
		return
	}

	response.JSONSuccess(w, "Data master gudang berhasil dimuat", warehouses)
}

// GetByID handles GET /api/v1/warehouses/{id}
func (h *Handler) GetByID(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		response.JSONError(w, http.StatusMethodNotAllowed, "Metode HTTP tidak diizinkan")
		return
	}

	parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(parts) < 4 {
		response.JSONBadRequest(w, "ID gudang wajib disertakan")
		return
	}
	id := parts[3]

	wh, err := h.service.GetWarehouseByID(id)
	if err != nil {
		response.JSONNotFound(w, err.Error())
		return
	}

	response.JSONSuccess(w, "Data gudang berhasil dimuat", wh)
}
