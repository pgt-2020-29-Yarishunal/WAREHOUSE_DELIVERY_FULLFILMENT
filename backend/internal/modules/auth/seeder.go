package auth

import (
	"backend/internal/pkg/password"
	"fmt"
	"log"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

// GetDefaultUsers returns warehouse accounts and executive account
func GetDefaultUsers() []User {
	apwID := "APW"
	bpwID := "BPW"
	dpwID := "DPW"
	rpwID := "RPW"

	return []User{
		{
			UserID:      "USR-APW",
			Username:    "gudang.apw",
			FullName:    "Petugas Gudang APW",
			Role:        "warehouse",
			WarehouseID: &apwID,
			Email:       "gudang.apw@gt-tires.com",
		},
		{
			UserID:      "USR-BPW",
			Username:    "gudang.bpw",
			FullName:    "Petugas Gudang BPW",
			Role:        "warehouse",
			WarehouseID: &bpwID,
			Email:       "gudang.bpw@gt-tires.com",
		},
		{
			UserID:      "USR-DPW",
			Username:    "gudang.dpw",
			FullName:    "Petugas Gudang DPW",
			Role:        "warehouse",
			WarehouseID: &dpwID,
			Email:       "gudang.dpw@gt-tires.com",
		},
		{
			UserID:      "USR-RPW",
			Username:    "gudang.rpw",
			FullName:    "Petugas Gudang RPW",
			Role:        "warehouse",
			WarehouseID: &rpwID,
			Email:       "gudang.rpw@gt-tires.com",
		},
		{
			UserID:      "USR-EXEC",
			Username:    "executive",
			FullName:    "Executive & Logistics Management",
			Role:        "executive",
			WarehouseID: nil,
			Email:       "executive@gt-tires.com",
		},
	}
}

// Seed inserts default user accounts per warehouse & executive
func Seed(db *gorm.DB) error {
	users := GetDefaultUsers()
	for _, u := range users {
		hash, err := password.HashPassword("password123")
		if err != nil {
			hash = "password123"
		}
		u.PasswordHash = hash

		if err := db.Clauses(clause.OnConflict{
			Columns:   []clause.Column{{Name: "username"}},
			DoUpdates: clause.AssignmentColumns([]string{"full_name", "role", "warehouse_id", "email", "password_hash"}),
		}).Create(&u).Error; err != nil {
			return fmt.Errorf("gagal seeding user %s: %w", u.Username, err)
		}
	}
	log.Printf("👤 [Auth Module] Berhasil seeding %d master users (gudang.apw, gudang.bpw, gudang.dpw, gudang.rpw, executive)", len(users))
	return nil
}
