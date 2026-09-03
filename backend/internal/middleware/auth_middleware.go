package middleware

import (
	"backend/config"
	"backend/internal/pkg/jwt"
	"backend/internal/pkg/response"
	"context"
	"net/http"
	"strings"
)

type contextKey string

const UserContextKey contextKey = "authenticated_user"

// AuthMiddleware validates JWT Bearer token
func AuthMiddleware(cfg *config.Config) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				response.JSONUnauthorized(w, "Header otentikasi (Authorization: Bearer <token>) tidak ditemukan")
				return
			}

			parts := strings.SplitN(authHeader, " ", 2)
			if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
				response.JSONUnauthorized(w, "Format token otentikasi tidak valid, gunakan 'Bearer <token>'")
				return
			}

			tokenString := parts[1]
			claims, err := jwt.ValidateToken(tokenString, cfg.JWTSecret)
			if err != nil {
				response.JSONUnauthorized(w, "Sesi login tidak valid atau telah kadaluarsa: "+err.Error())
				return
			}

			ctx := context.WithValue(r.Context(), UserContextKey, claims)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// GetUserFromContext retrieves UserClaims from request context
func GetUserFromContext(ctx context.Context) (*jwt.UserClaims, bool) {
	claims, ok := ctx.Value(UserContextKey).(*jwt.UserClaims)
	return claims, ok
}
