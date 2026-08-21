package services

import (
	"database/sql"
	"errors"
	"fmt"

	"portfolio/internal/db"
	"portfolio/internal/models"
)

type ContactService struct {
	db     *sql.DB
	driver string
}

func NewContactService(database *sql.DB, driver string) *ContactService {
	return &ContactService{
		db:     database,
		driver: driver,
	}
}

func (s *ContactService) Create(c *models.Formulario) error {
	if c.Nombre == "" || c.Mail == "" || c.Texto == "" {
		return errors.New("los campos Nombre, Mail y Texto son obligatorios")
	}

	if s.driver == "postgres" || s.driver == "postgresql" || s.driver == "pgx" {
		query := "INSERT INTO FORMULARIO (Nombre, Mail, Telefono, Texto) VALUES ($1, $2, $3, $4) RETURNING Id_form"
		err := s.db.QueryRow(query, c.Nombre, c.Mail, c.Telefono, c.Texto).Scan(&c.ID_form)
		if err != nil {
			return fmt.Errorf("error al guardar mensaje en postgres: %w", err)
		}
		return nil
	}

	result, err := s.db.Exec(
		"INSERT INTO FORMULARIO (Nombre, Mail, Telefono, Texto) VALUES (?, ?, ?, ?)",
		c.Nombre, c.Mail, c.Telefono, c.Texto,
	)
	if err != nil {
		return fmt.Errorf("error al guardar mensaje de contacto: %w", err)
	}

	id, err := result.LastInsertId()
	if err == nil {
		c.ID_form = int(id)
	}
	return nil
}

func (s *ContactService) GetAll() ([]models.Formulario, error) {
	rows, err := s.db.Query("SELECT Id_form, Nombre, Mail, Telefono, Texto, Created_At FROM FORMULARIO ORDER BY Id_form DESC")
	if err != nil {
		return nil, fmt.Errorf("error al obtener mensajes: %w", err)
	}
	defer rows.Close()

	list := make([]models.Formulario, 0)
	for rows.Next() {
		var c models.Formulario
		if err := rows.Scan(&c.ID_form, &c.Nombre, &c.Mail, &c.Telefono, &c.Texto, &c.CreatedAt); err != nil {
			return nil, err
		}
		list = append(list, c)
	}
	return list, nil
}

func (s *ContactService) GetByID(id int) (*models.Formulario, error) {
	var c models.Formulario
	query := db.AdaptQuery("SELECT Id_form, Nombre, Mail, Telefono, Texto, Created_At FROM FORMULARIO WHERE Id_form = ?", s.driver)
	row := s.db.QueryRow(query, id)
	err := row.Scan(&c.ID_form, &c.Nombre, &c.Mail, &c.Telefono, &c.Texto, &c.CreatedAt)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, errors.New("mensaje no encontrado")
		}
		return nil, err
	}
	return &c, nil
}

func (s *ContactService) Delete(id int) error {
	query := db.AdaptQuery("DELETE FROM FORMULARIO WHERE Id_form = ?", s.driver)
	result, err := s.db.Exec(query, id)
	if err != nil {
		return fmt.Errorf("error al eliminar mensaje: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil || rowsAffected == 0 {
		return errors.New("mensaje no encontrado")
	}
	return nil
}

func (s *ContactService) Count() (int, error) {
	var count int
	err := s.db.QueryRow("SELECT COUNT(*) FROM FORMULARIO").Scan(&count)
	return count, err
}
