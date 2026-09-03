package auth

import (
	"backend/internal/middleware"
	"backend/internal/pkg/response"
	"encoding/json"
	"net/http"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

// Login handles POST /api/v1/auth/login
func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		response.JSONError(w, http.StatusMethodNotAllowed, "Metode HTTP tidak diizinkan")
		return
	}

	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.JSONBadRequest(w, "Format payload JSON tidak valid")
		return
	}

	resp, err := h.service.Login(req)
	if err != nil {
		response.JSONUnauthorized(w, err.Error())
		return
	}

	response.JSONSuccess(w, "Login berhasil, selamat datang di Delivery Dashboard GT", resp)
}

// GetMe handles GET /api/v1/auth/me (Protected)
func (h *Handler) GetMe(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		response.JSONError(w, http.StatusMethodNotAllowed, "Metode HTTP tidak diizinkan")
		return
	}

	claims, ok := middleware.GetUserFromContext(r.Context())
	if !ok {
		response.JSONUnauthorized(w, "Sesi pengguna tidak teridentifikasi")
		return
	}

	profile, err := h.service.GetProfile(claims.UserID)
	if err != nil {
		response.JSONNotFound(w, "Data profil pengguna tidak ditemukan")
		return
	}

	response.JSONSuccess(w, "Profil pengguna berhasil dimuat", profile)
}

// GetPresets handles GET /api/v1/auth/presets
func (h *Handler) GetPresets(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		response.JSONError(w, http.StatusMethodNotAllowed, "Metode HTTP tidak diizinkan")
		return
	}

	users, err := h.service.GetAllUsers()
	if err != nil {
		response.JSONError(w, http.StatusInternalServerError, "Gagal memuat daftar preset pengguna: "+err.Error())
		return
	}

	response.JSONSuccess(w, "Daftar preset akun gudang berhasil dimuat", users)
}

// Logout handles POST /api/v1/auth/logout
func (h *Handler) Logout(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		response.JSONError(w, http.StatusMethodNotAllowed, "Metode HTTP tidak diizinkan")
		return
	}

	response.JSONSuccess(w, "Sesi logout berhasil", map[string]interface{}{
		"logged_out": true,
	})
}
