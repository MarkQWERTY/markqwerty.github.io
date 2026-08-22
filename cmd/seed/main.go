package main

import (
	"log"

	"portfolio/internal/config"
	"portfolio/internal/db"
)

func main() {
	log.Println("Cargando configuración...")
	cfg := config.LoadConfig()

	log.Println("Inicializando base de datos y sembrando datos por defecto...")
	database, err := db.InitDB(cfg)
	if err != nil {
		log.Fatalf("Error fatal al inicializar la base de datos: %v", err)
	}
	defer database.Close()

	log.Println("¡Base de datos inicializada y administrador por defecto sembrado exitosamente!")
}
