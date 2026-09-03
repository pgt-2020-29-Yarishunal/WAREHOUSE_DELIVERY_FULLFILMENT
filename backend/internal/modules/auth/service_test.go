package auth_test

import (
	"backend/config"
	"backend/internal/modules/auth"
	"backend/internal/modules/warehouse"
	"backend/internal/pkg/jwt"
	"testing"
)

func setupTestDB(t *testing.T) (*config.Config, auth.Repository) {
	cfg := config.LoadConfig()

	db, err := config.InitDB(cfg)
	if err != nil {
		t.Fatalf("Failed to init test DB: %v", err)
	}

	if err := config.MigrateDB(db, &warehouse.Warehouse{}, &auth.User{}); err != nil {
		t.Fatalf("Failed to migrate test DB: %v", err)
	}

	if err := warehouse.Seed(db); err != nil {
		t.Fatalf("Failed to seed warehouses: %v", err)
	}

	if err := auth.Seed(db); err != nil {
		t.Fatalf("Failed to seed users: %v", err)
	}

	return cfg, auth.NewRepository(db)
}

func TestAuthService_LoginSuccess(t *testing.T) {
	cfg, userRepo := setupTestDB(t)
	authSvc := auth.NewService(userRepo, cfg.JWTSecret, cfg.JWTExpiresIn)

	resp, err := authSvc.Login(auth.LoginRequest{
		Username: "gudang.bpw",
		Password: "password123",
	})

	if err != nil {
		t.Fatalf("Expected login success, got error: %v", err)
	}

	if resp.AccessToken == "" {
		t.Fatal("Expected access token in response, got empty string")
	}

	if resp.User.WarehouseID == nil || *resp.User.WarehouseID != "BPW" {
		t.Fatalf("Expected warehouse BPW, got: %v", resp.User.WarehouseID)
	}

	// Validate JWT
	claims, err := jwt.ValidateToken(resp.AccessToken, cfg.JWTSecret)
	if err != nil {
		t.Fatalf("Failed to validate generated JWT: %v", err)
	}

	if claims.Username != "gudang.bpw" {
		t.Fatalf("Expected claims username gudang.bpw, got: %s", claims.Username)
	}
}

func TestAuthService_LoginInvalidPassword(t *testing.T) {
	cfg, userRepo := setupTestDB(t)
	authSvc := auth.NewService(userRepo, cfg.JWTSecret, cfg.JWTExpiresIn)

	_, err := authSvc.Login(auth.LoginRequest{
		Username: "gudang.apw",
		Password: "wrong_password",
	})

	if err == nil {
		t.Fatal("Expected login error for wrong password, got nil")
	}
}
