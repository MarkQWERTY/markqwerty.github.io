package config

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	Port               string
	JWTSecret          string
	DBDriver           string
	DBSource           string
	AdminDefaultID     int
	AdminDefaultPass   string
	AdminDefaultNombre string
	AdminDefaultApe    string
}

func LoadConfig() *Config {
	// Try loading .env file if present in root
	if err := godotenv.Load(); err != nil {
		log.Println("Note: No .env file found or error loading it, using system environment variables and defaults")
	} else {
		log.Println("Successfully loaded environment variables from .env file")
	}

	port := getEnv("PORT", "8080")
	jwtSecret := getEnv("JWT_SECRET", "super_secret_jwt_key_change_in_production")

	// Detect if DATABASE_URL is present (e.g. Supabase, Render, Neon, Railway)
	databaseURL := os.Getenv("DATABASE_URL")
	defaultDriver := "sqlite"
	defaultSource := "./portfolio.db"

	if databaseURL != "" {
		defaultDriver = "postgres"
		defaultSource = databaseURL
	}

	dbDriver := getEnv("DB_DRIVER", defaultDriver)
	dbSource := getEnv("DB_SOURCE", defaultSource)

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
