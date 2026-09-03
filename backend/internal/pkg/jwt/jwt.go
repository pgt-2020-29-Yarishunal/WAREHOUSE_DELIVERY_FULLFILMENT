package jwt

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// UserClaims defines JWT token payload
type UserClaims struct {
	UserID      string  `json:"user_id"`
	Username    string  `json:"username"`
	FullName    string  `json:"full_name"`
	Role        string  `json:"role"`
	WarehouseID *string `json:"warehouse_id,omitempty"`
	jwt.RegisteredClaims
}

// GenerateToken creates signed JWT string
func GenerateToken(claims UserClaims, secret string, duration time.Duration) (string, int64, error) {
	expirationTime := time.Now().Add(duration)
	claims.RegisteredClaims = jwt.RegisteredClaims{
		ExpiresAt: jwt.NewNumericDate(expirationTime),
		IssuedAt:  jwt.NewNumericDate(time.Now()),
		Issuer:    "gajah-tunggal-warehouse-auth",
		Subject:   claims.UserID,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", 0, err
	}

	return tokenString, int64(duration.Seconds()), nil
}

// ValidateToken verifies and parses token string
func ValidateToken(tokenString, secret string) (*UserClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &UserClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("metode signing token tidak valid")
		}
		return []byte(secret), nil
	})

	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*UserClaims)
	if !ok || !token.Valid {
		return nil, errors.New("token otentikasi tidak valid atau kadaluarsa")
	}

	return claims, nil
}
