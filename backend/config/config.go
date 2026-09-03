package config

import (
	"os"
	"time"
)

type Config struct {
	Port         string
	JWTSecret    string
	JWTExpiresIn time.Duration
	APIPrefix    string
	Environment  string
	DBDriver     string
	DBUser       string
	DBPassword   string
	DBHost       string
	DBPort       string
	DBName       string
	DBDSN        string
}

func LoadConfig() *Config {
	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "gajah_tunggal_warehouse_delivery_jwt_secret_2026_key"
	}

	dbDriver := os.Getenv("DB_DRIVER")
	if dbDriver == "" {
		dbDriver = "mysql"
	}

	dbUser := os.Getenv("DB_USER")
	if dbUser == "" {
		dbUser = "root"
	}

	dbPassword := os.Getenv("DB_PASSWORD")

	dbHost := os.Getenv("DB_HOST")
	if dbHost == "" {
		dbHost = "127.0.0.1"
	}

	dbPort := os.Getenv("DB_PORT")
	if dbPort == "" {
		dbPort = "3306"
	}

	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		dbName = "delivery_dashboard_gudang"
	}

	dbDSN := os.Getenv("DB_DSN")
	if dbDSN == "" {
		// Example: root:password@tcp(127.0.0.1:3306)/delivery_dashboard_gudang?charset=utf8mb4&parseTime=True&loc=Local
		if dbPassword != "" {
			dbDSN = dbUser + ":" + dbPassword + "@tcp(" + dbHost + ":" + dbPort + ")/" + dbName + "?charset=utf8mb4&parseTime=True&loc=Local"
		} else {
			dbDSN = dbUser + "@tcp(" + dbHost + ":" + dbPort + ")/" + dbName + "?charset=utf8mb4&parseTime=True&loc=Local"
		}
	}

	return &Config{
		Port:         port,
		JWTSecret:    jwtSecret,
		JWTExpiresIn: 24 * time.Hour,
		APIPrefix:    "/api/v1",
		Environment:  "development",
		DBDriver:     dbDriver,
		DBUser:       dbUser,
		DBPassword:   dbPassword,
		DBHost:       dbHost,
		DBPort:       dbPort,
		DBName:       dbName,
		DBDSN:        dbDSN,
	}
}
