package dashboard

import (
	"backend/internal/pkg/jwt"
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

func (h *Handler) resolveWarehouseID(r *http.Request) string {
	qWh := strings.TrimSpace(r.URL.Query().Get("warehouse_id"))
	if qWh != "" {
		return qWh
	}

	claims, ok := r.Context().Value("user_claims").(*jwt.UserClaims)
	if ok && claims != nil {
		if claims.Role == "executive" {
			return "ALL"
		}
		if claims.WarehouseID != nil && *claims.WarehouseID != "" {
			return *claims.WarehouseID
		}
	}

	return "BPW"
}

func (h *Handler) GetFilters(w http.ResponseWriter, r *http.Request) {
	whID := h.resolveWarehouseID(r)
	config := h.service.GetFilterConfig(whID)
	response.JSONSuccess(w, "Konfigurasi filter dashboard", config)
}

func (h *Handler) GetTopBar(w http.ResponseWriter, r *http.Request) {
	whID := h.resolveWarehouseID(r)
	salesType := r.URL.Query().Get("sales_type")
	prodType := r.URL.Query().Get("product_type")
	brand := r.URL.Query().Get("brand")

	data, err := h.service.GetTopBarMetrics(whID, salesType, prodType, brand)
	if err != nil {
		response.JSONError(w, http.StatusInternalServerError, err.Error())
		return
	}
	response.JSONSuccess(w, "Metrik TopBar Dashboard", data)
}

func (h *Handler) GetSOStatus(w http.ResponseWriter, r *http.Request) {
	whID := h.resolveWarehouseID(r)
	salesType := r.URL.Query().Get("sales_type")
	prodType := r.URL.Query().Get("product_type")
	brand := r.URL.Query().Get("brand")

	data, err := h.service.GetSalesOrderStatus(whID, salesType, prodType, brand)
	if err != nil {
		response.JSONError(w, http.StatusInternalServerError, err.Error())
		return
	}
	response.JSONSuccess(w, "Status Sales Order", data)
}

func (h *Handler) GetActualVsSupply(w http.ResponseWriter, r *http.Request) {
	whID := h.resolveWarehouseID(r)
	salesType := r.URL.Query().Get("sales_type")
	prodType := r.URL.Query().Get("product_type")
	brand := r.URL.Query().Get("brand")

	data, err := h.service.GetActualVsSupply(whID, salesType, prodType, brand)
	if err != nil {
		response.JSONError(w, http.StatusInternalServerError, err.Error())
		return
	}
	response.JSONSuccess(w, "Actual Sales vs Supply Plan", data)
}

func (h *Handler) GetAreaAchievement(w http.ResponseWriter, r *http.Request) {
	whID := h.resolveWarehouseID(r)
	salesType := r.URL.Query().Get("sales_type")
	prodType := r.URL.Query().Get("product_type")
	brand := r.URL.Query().Get("brand")

	data, err := h.service.GetAreaAchievement(whID, salesType, prodType, brand)
	if err != nil {
		response.JSONError(w, http.StatusInternalServerError, err.Error())
		return
	}
	response.JSONSuccess(w, "Pencapaian per Area", data)
}

func (h *Handler) GetSpatialMap(w http.ResponseWriter, r *http.Request) {
	whID := h.resolveWarehouseID(r)
	salesType := r.URL.Query().Get("sales_type")
	prodType := r.URL.Query().Get("product_type")
	brand := r.URL.Query().Get("brand")

	data, err := h.service.GetSpatialMapData(whID, salesType, prodType, brand)
	if err != nil {
		response.JSONError(w, http.StatusInternalServerError, err.Error())
		return
	}
	response.JSONSuccess(w, "Data Spatial Map Indonesia", data)
}

func (h *Handler) GetBottleneckSKUs(w http.ResponseWriter, r *http.Request) {
	whID := h.resolveWarehouseID(r)
	salesType := r.URL.Query().Get("sales_type")
	prodType := r.URL.Query().Get("product_type")
	brand := r.URL.Query().Get("brand")

	data, err := h.service.GetBottleneckSKUs(whID, salesType, prodType, brand)
	if err != nil {
		response.JSONError(w, http.StatusInternalServerError, err.Error())
		return
	}
	response.JSONSuccess(w, "Top Bottleneck SKUs", data)
}

func (h *Handler) GetWarehouseSO(w http.ResponseWriter, r *http.Request) {
	whID := h.resolveWarehouseID(r)
	salesType := r.URL.Query().Get("sales_type")
	prodType := r.URL.Query().Get("product_type")
	brand := r.URL.Query().Get("brand")

	data, err := h.service.GetWarehouseSOStatus(whID, salesType, prodType, brand)
	if err != nil {
		response.JSONError(w, http.StatusInternalServerError, err.Error())
		return
	}
	response.JSONSuccess(w, "Status SO Masuk Gudang", data)
}

func (h *Handler) GetDailyTruckPlan(w http.ResponseWriter, r *http.Request) {
	whID := h.resolveWarehouseID(r)
	salesType := r.URL.Query().Get("sales_type")
	prodType := r.URL.Query().Get("product_type")
	brand := r.URL.Query().Get("brand")

	data, err := h.service.GetDailyTruckPlan(whID, salesType, prodType, brand)
	if err != nil {
		response.JSONError(w, http.StatusInternalServerError, err.Error())
		return
	}
	response.JSONSuccess(w, "Rencana Truk Harian", data)
}

func (h *Handler) GetProvinceTrucks(w http.ResponseWriter, r *http.Request) {
	whID := h.resolveWarehouseID(r)
	salesType := r.URL.Query().Get("sales_type")
	prodType := r.URL.Query().Get("product_type")
	brand := r.URL.Query().Get("brand")

	data, err := h.service.GetProvinceTrucks(whID, salesType, prodType, brand)
	if err != nil {
		response.JSONError(w, http.StatusInternalServerError, err.Error())
		return
	}
	response.JSONSuccess(w, "Distribusi Truk per Provinsi", data)
}

func (h *Handler) GetRepSOPreview(w http.ResponseWriter, r *http.Request) {
	whID := h.resolveWarehouseID(r)
	salesType := r.URL.Query().Get("sales_type")
	prodType := r.URL.Query().Get("product_type")
	brand := r.URL.Query().Get("brand")
	province := r.URL.Query().Get("province")

	data, err := h.service.GetRepSOPreview(whID, salesType, prodType, brand, province)
	if err != nil {
		response.JSONError(w, http.StatusInternalServerError, err.Error())
		return
	}
	response.JSONSuccess(w, "Preview SO Area REP", data)
}
