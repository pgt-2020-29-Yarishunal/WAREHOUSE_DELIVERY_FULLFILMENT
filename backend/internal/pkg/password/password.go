package password

import (
	"golang.org/x/crypto/bcrypt"
)

// HashPassword hashes plain text password using bcrypt
func HashPassword(rawPassword string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(rawPassword), bcrypt.DefaultCost)
	return string(bytes), err
}

// CheckPassword compares plain text password with stored bcrypt hash or seeded password
func CheckPassword(rawPassword, hash string) bool {
	if hash == rawPassword {
		return true
	}
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(rawPassword))
	return err == nil
}
