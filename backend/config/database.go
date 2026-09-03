package config

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// InitDB initializes database connection using GORM MySQL
func InitDB(cfg *Config) (*gorm.DB, error) {
	// 1. Ensure MySQL database exists (auto-create if not exists)
	serverDSN := cfg.DBUser
	if cfg.DBPassword != "" {
		serverDSN += ":" + cfg.DBPassword
	}
	serverDSN += "@tcp(" + cfg.DBHost + ":" + cfg.DBPort + ")/?charset=utf8mb4&parseTime=True&loc=Local"

	rawDB, err := sql.Open("mysql", serverDSN)
	if err == nil {
		defer rawDB.Close()
		createQuery := fmt.Sprintf("CREATE DATABASE IF NOT EXISTS `%s` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;", cfg.DBName)
		if _, err := rawDB.Exec(createQuery); err != nil {
			log.Printf("⚠️ Catatan pembuatan database: %v", err)
		}
	}

	// 2. Open GORM connection to target database
	gormConfig := &gorm.Config{
		Logger:                                  logger.Default.LogMode(logger.Warn),
		DisableForeignKeyConstraintWhenMigrating: true,
	}

	db, err := gorm.Open(mysql.Open(cfg.DBDSN), gormConfig)
	if err != nil {
		return nil, fmt.Errorf("gagal membuka koneksi MySQL (%s): %w", cfg.DBDSN, err)
	}

	log.Printf("✅ Koneksi database MySQL GORM berhasil (DB: %s)", cfg.DBName)
	return db, nil
}

// MigrateDB runs GORM AutoMigrate for given model entities
func MigrateDB(db *gorm.DB, dst ...interface{}) error {
	log.Println("🔄 Menjalankan migrasi skema database GORM...")

	if err := db.AutoMigrate(dst...); err != nil {
		return fmt.Errorf("migrasi database gagal: %w", err)
	}

	log.Println("✅ Migrasi skema database berhasil")
	return nil
}

