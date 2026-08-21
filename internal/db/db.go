package db

import (
	"database/sql"
	"fmt"
	"log"
	"strings"

	_ "github.com/jackc/pgx/v5/stdlib"
	_ "github.com/lib/pq"
	_ "modernc.org/sqlite"
	"golang.org/x/crypto/bcrypt"

	"portfolio/internal/config"
)

// Helper to convert queries with ? placeholders to $1, $2, ... for PostgreSQL
func AdaptQuery(query string, driver string) string {
	if driver != "postgres" && driver != "postgresql" && driver != "pgx" {
		return query
	}

	var sb strings.Builder
	paramIndex := 1
	for _, ch := range query {
		if ch == '?' {
			sb.WriteString(fmt.Sprintf("$%d", paramIndex))
			paramIndex++
		} else {
			sb.WriteRune(ch)
		}
	}
	return sb.String()
}

func InitDB(cfg *config.Config) (*sql.DB, error) {
	driverName := cfg.DBDriver
	if driverName == "sqlite3" {
		driverName = "sqlite"
	} else if driverName == "postgresql" || driverName == "postgres" {
		driverName = "pgx"
	}

	log.Printf("Connecting to database using driver: %s", driverName)
	database, err := sql.Open(driverName, cfg.DBSource)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	if err := database.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}
	log.Println("Database connection successfully established and pinged.")

	isPostgres := (driverName == "postgres" || driverName == "pgx")

	// Table schemas
	var createAdminTable, createFormularioTable, createProyectoTable string

	if isPostgres {
		createAdminTable = `
		CREATE TABLE IF NOT EXISTS ADMINISTRADOR (
			Id INTEGER PRIMARY KEY,
			Password TEXT NOT NULL,
			Nombre TEXT NOT NULL,
			Apellidos TEXT NOT NULL,
			Created_At TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		);`

		createFormularioTable = `
		CREATE TABLE IF NOT EXISTS FORMULARIO (
			Id_form SERIAL PRIMARY KEY,
			Nombre TEXT NOT NULL,
			Mail TEXT NOT NULL,
			Telefono TEXT NOT NULL,
			Texto TEXT NOT NULL,
			Created_At TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		);`

		createProyectoTable = `
		CREATE TABLE IF NOT EXISTS PROYECTO (
			ID_proyecto SERIAL PRIMARY KEY,
			Nombre_p TEXT NOT NULL,
			Descripcion TEXT NOT NULL,
			Github TEXT NOT NULL,
			Enlace TEXT,
			Created_At TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		);`
	} else {
		createAdminTable = `
		CREATE TABLE IF NOT EXISTS ADMINISTRADOR (
			Id INTEGER PRIMARY KEY,
			Password TEXT NOT NULL,
			Nombre TEXT NOT NULL,
			Apellidos TEXT NOT NULL,
			Created_At DATETIME DEFAULT CURRENT_TIMESTAMP
		);`

		createFormularioTable = `
		CREATE TABLE IF NOT EXISTS FORMULARIO (
			Id_form INTEGER PRIMARY KEY AUTOINCREMENT,
			Nombre TEXT NOT NULL,
			Mail TEXT NOT NULL,
			Telefono TEXT NOT NULL,
			Texto TEXT NOT NULL,
			Created_At DATETIME DEFAULT CURRENT_TIMESTAMP
		);`

		createProyectoTable = `
		CREATE TABLE IF NOT EXISTS PROYECTO (
			ID_proyecto INTEGER PRIMARY KEY AUTOINCREMENT,
			Nombre_p TEXT NOT NULL,
			Descripcion TEXT NOT NULL,
			Github TEXT NOT NULL,
			Enlace TEXT,
			Created_At DATETIME DEFAULT CURRENT_TIMESTAMP
		);`
	}

	for _, query := range []string{createAdminTable, createFormularioTable, createProyectoTable} {
		if _, err := database.Exec(query); err != nil {
			return nil, fmt.Errorf("failed to execute schema query: %w", err)
		}
	}

	// Seed default admin if not exists
	var count int
	checkAdminQuery := AdaptQuery("SELECT COUNT(*) FROM ADMINISTRADOR", driverName)
	err = database.QueryRow(checkAdminQuery).Scan(&count)
	if err != nil || count == 0 {
		hashedPass, err := bcrypt.GenerateFromPassword([]byte(cfg.AdminDefaultPass), bcrypt.DefaultCost)
		if err != nil {
			return nil, fmt.Errorf("failed to hash default admin password: %w", err)
		}

		insertAdminQuery := AdaptQuery("INSERT INTO ADMINISTRADOR (Id, Password, Nombre, Apellidos) VALUES (?, ?, ?, ?)", driverName)
		_, err = database.Exec(
			insertAdminQuery,
			cfg.AdminDefaultID, string(hashedPass), cfg.AdminDefaultNombre, cfg.AdminDefaultApe,
		)
		if err != nil {
			log.Printf("Warning: failed to seed default admin: %v", err)
		} else {
			log.Println("Default admin user initialized successfully.")
		}
	}

	// Seed sample projects if empty
	var projCount int
	err = database.QueryRow("SELECT COUNT(*) FROM PROYECTO").Scan(&projCount)
	if err == nil && projCount == 0 {
		sampleProjects := []struct {
			Nombre, Desc, Github, Enlace string
		}{
			{
				Nombre: "E-Commerce Microservicios",
				Desc:   "Plataforma de comercio electrónico con arquitectura monolito modular en Go, integración de pasarela de pago y catálogo en tiempo real.",
				Github: "https://github.com/usuario/ecommerce-go",
				Enlace: "https://demo-ecommerce.ejemplo.com",
			},
			{
				Nombre: "CLI Tool de Análisis de Logs",
				Desc:   "Herramienta CLI desarrollada en Go para el análisis concurrente y parseo de logs con reporte de métricas en tiempo real.",
				Github: "https://github.com/usuario/go-log-parser",
				Enlace: "",
			},
			{
				Nombre: "API REST de Gestión de Tareas",
				Desc:   "API RESTful de alto rendimiento con autenticación JWT, rate limiting y pruebas automatizadas con Playwright.",
				Github: "https://github.com/usuario/task-manager-api",
				Enlace: "https://taskmanager.ejemplo.com",
			},
		}

		insertProj := AdaptQuery("INSERT INTO PROYECTO (Nombre_p, Descripcion, Github, Enlace) VALUES (?, ?, ?, ?)", driverName)
		for _, p := range sampleProjects {
			_, _ = database.Exec(
				insertProj,
				p.Nombre, p.Desc, p.Github, p.Enlace,
			)
		}
		log.Println("Sample projects seeded successfully.")
	}

	return database, nil
}
