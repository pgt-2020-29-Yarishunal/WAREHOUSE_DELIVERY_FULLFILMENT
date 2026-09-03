package response

import (
	"encoding/json"
	"net/http"
)

type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

func JSONSuccess(w http.ResponseWriter, message string, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(APIResponse{
		Success: true,
		Message: message,
		Data:    data,
	})
}

func JSONError(w http.ResponseWriter, statusCode int, errMsg string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	_ = json.NewEncoder(w).Encode(APIResponse{
		Success: false,
		Message: "Permintaan gagal diproses",
		Error:   errMsg,
	})
}

func JSONBadRequest(w http.ResponseWriter, errMsg string) {
	JSONError(w, http.StatusBadRequest, errMsg)
}

func JSONUnauthorized(w http.ResponseWriter, errMsg string) {
	JSONError(w, http.StatusUnauthorized, errMsg)
}

func JSONNotFound(w http.ResponseWriter, errMsg string) {
	JSONError(w, http.StatusNotFound, errMsg)
}
