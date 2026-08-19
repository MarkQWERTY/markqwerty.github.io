package services

import (
	"database/sql"
	"errors"
	"fmt"

	"portfolio/internal/models"
)

type ContactService struct {
	db *sql.DB
}

func NewContactService(db *sql.DB) *ContactService {
	return &ContactService{db: db}
}

func (s *ContactService) Create(c *models.Formulario) error {
	if c.Nombre == "" || c.Mail == "" || c.Texto == "" {
		return errors.New("los campos Nombre, Mail y Texto son obligatorios")
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
	row := s.db.QueryRow("SELECT Id_form, Nombre, Mail, Telefono, Texto, Created_At FROM FORMULARIO WHERE Id_form = ?", id)
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
	result, err := s.db.Exec("DELETE FROM FORMULARIO WHERE Id_form = ?", id)
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
