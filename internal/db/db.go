package db

import (
	"database/sql"
	"fmt"
	"log"

	_ "modernc.org/sqlite"
	"golang.org/x/crypto/bcrypt"

	"portfolio/internal/config"
)

func InitDB(cfg *config.Config) (*sql.DB, error) {
	driverName := cfg.DBDriver
	if driverName == "sqlite3" {
		driverName = "sqlite"
	}
	database, err := sql.Open(driverName, cfg.DBSource)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	if err := database.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	// Create tables matching specs
	createAdminTable := `
	CREATE TABLE IF NOT EXISTS ADMINISTRADOR (
		Id INTEGER PRIMARY KEY,
		Password TEXT NOT NULL,
		Nombre TEXT NOT NULL,
		Apellidos TEXT NOT NULL,
		Created_At DATETIME DEFAULT CURRENT_TIMESTAMP
	);`

	createFormularioTable := `
	CREATE TABLE IF NOT EXISTS FORMULARIO (
		Id_form INTEGER PRIMARY KEY AUTOINCREMENT,
		Nombre TEXT NOT NULL,
		Mail TEXT NOT NULL,
		Telefono TEXT NOT NULL,
		Texto TEXT NOT NULL,
		Created_At DATETIME DEFAULT CURRENT_TIMESTAMP
	);`

	createProyectoTable := `
	CREATE TABLE IF NOT EXISTS PROYECTO (
		ID_proyecto INTEGER PRIMARY KEY AUTOINCREMENT,
		Nombre_p TEXT NOT NULL,
		Descripcion TEXT NOT NULL,
		Github TEXT NOT NULL,
		Enlace TEXT,
		Created_At DATETIME DEFAULT CURRENT_TIMESTAMP
	);`

	for _, query := range []string{createAdminTable, createFormularioTable, createProyectoTable} {
		if _, err := database.Exec(query); err != nil {
			return nil, fmt.Errorf("failed to execute schema query: %w", err)
		}
	}

	// Seed default admin if not exists
	var count int
	err = database.QueryRow("SELECT COUNT(*) FROM ADMINISTRADOR WHERE Id = ?", cfg.AdminDefaultID).Scan(&count)
	if err != nil || count == 0 {
		hashedPass, err := bcrypt.GenerateFromPassword([]byte(cfg.AdminDefaultPass), bcrypt.DefaultCost)
		if err != nil {
			return nil, fmt.Errorf("failed to hash default admin password: %w", err)
		}

		_, err = database.Exec(
			"INSERT INTO ADMINISTRADOR (Id, Password, Nombre, Apellidos) VALUES (?, ?, ?, ?)",
			cfg.AdminDefaultID, string(hashedPass), cfg.AdminDefaultNombre, cfg.AdminDefaultApe,
		)
		if err != nil {
			log.Printf("Warning: failed to seed default admin: %v", err)
		} else {
			log.Println("Default admin user created successfully.")
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
				Nombre:      "E-Commerce Microservicios",
				Desc:        "Plataforma de comercio electrónico con arquitectura monolito modular en Go, integración de pasarela de pago y catálogo en tiempo real.",
				Github:      "https://github.com/usuario/ecommerce-go",
				Enlace:      "https://demo-ecommerce.ejemplo.com",
			},
			{
				Nombre:      "CLI Tool de Análisis de Logs",
				Desc:        "Herramienta CLI desarrollada en Go para el análisis concurrente y parseo de logs con reporte de métricas en tiempo real.",
				Github:      "https://github.com/usuario/go-log-parser",
				Enlace:      "",
			},
			{
				Nombre:      "API REST de Gestión de Tareas",
				Desc:        "API RESTful de alto rendimiento con autenticación JWT, rate limiting y pruebas automatizadas con Playwright.",
				Github:      "https://github.com/usuario/task-manager-api",
				Enlace:      "https://taskmanager.ejemplo.com",
			},
		}

		for _, p := range sampleProjects {
			_, _ = database.Exec(
				"INSERT INTO PROYECTO (Nombre_p, Descripcion, Github, Enlace) VALUES (?, ?, ?, ?)",
				p.Nombre, p.Desc, p.Github, p.Enlace,
			)
		}
		log.Println("Sample projects seeded successfully.")
	}

	return database, nil
}
