package auth

import (
	"backend/internal/pkg/jwt"
	"backend/internal/pkg/password"
	"errors"
	"strings"
	"time"
)

type Service interface {
	Login(req LoginRequest) (*LoginResponse, error)
	GetProfile(userID string) (*User, error)
	GetAllUsers() ([]User, error)
}

type service struct {
	repo         Repository
	jwtSecret    string
	jwtExpiresIn time.Duration
}

func NewService(repo Repository, jwtSecret string, jwtExpiresIn time.Duration) Service {
	return &service{
		repo:         repo,
		jwtSecret:    jwtSecret,
		jwtExpiresIn: jwtExpiresIn,
	}
}

func (s *service) Login(req LoginRequest) (*LoginResponse, error) {
	cleanUsername := strings.TrimSpace(req.Username)
	if cleanUsername == "" || req.Password == "" {
		return nil, errors.New("username dan password wajib diisi")
	}

	user, err := s.repo.FindByUsername(cleanUsername)
	if err != nil {
		return nil, errors.New("username atau password salah")
	}

	// Verify password
	if !password.CheckPassword(req.Password, user.PasswordHash) {
		return nil, errors.New("username atau password salah")
	}

	// Generate JWT token
	claims := jwt.UserClaims{
		UserID:      user.UserID,
		Username:    user.Username,
		FullName:    user.FullName,
		Role:        user.Role,
		WarehouseID: user.WarehouseID,
	}

	token, expiresIn, err := jwt.GenerateToken(claims, s.jwtSecret, s.jwtExpiresIn)
	if err != nil {
		return nil, errors.New("gagal menerbitkan token otentikasi: " + err.Error())
	}

	return &LoginResponse{
		AccessToken: token,
		TokenType:   "Bearer",
		ExpiresIn:   expiresIn,
		User:        *user,
	}, nil
}

func (s *service) GetProfile(userID string) (*User, error) {
	return s.repo.FindByID(userID)
}

func (s *service) GetAllUsers() ([]User, error) {
	return s.repo.GetAll()
}
