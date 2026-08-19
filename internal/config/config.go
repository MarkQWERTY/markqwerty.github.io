package config

import (
	"os"
	"strconv"
)

type Config struct {
	Port                string
	JWTSecret           string
	DBDriver            string
	DBSource            string
	AdminDefaultID      int
	AdminDefaultPass    string
	AdminDefaultNombre  string
	AdminDefaultApe     string
}

func LoadConfig() *Config {
	port := getEnv("PORT", "8080")
	jwtSecret := getEnv("JWT_SECRET", "super_secret_jwt_key_change_in_production")
	dbDriver := getEnv("DB_DRIVER", "sqlite")
	dbSource := getEnv("DB_SOURCE", "./portfolio.db")

	adminIDStr := getEnv("ADMIN_DEFAULT_ID", "1")
	adminID, err := strconv.Atoi(adminIDStr)
	if err != nil {
		adminID = 1
	}

	adminPass := getEnv("ADMIN_DEFAULT_PASS", "admin123")
	adminNombre := getEnv("ADMIN_DEFAULT_NOMBRE", "Marcos")
	adminApe := getEnv("ADMIN_DEFAULT_APELLIDOS", "García")

	return &Config{
		Port:               port,
		JWTSecret:          jwtSecret,
		DBDriver:           dbDriver,
		DBSource:           dbSource,
		AdminDefaultID:     adminID,
		AdminDefaultPass:   adminPass,
		AdminDefaultNombre: adminNombre,
		AdminDefaultApe:    adminApe,
	}
}

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}
