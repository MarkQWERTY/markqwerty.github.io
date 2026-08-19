package services

import (
	"database/sql"
	"errors"
	"fmt"

	"portfolio/internal/models"
)

type ProjectService struct {
	db *sql.DB
}

func NewProjectService(db *sql.DB) *ProjectService {
	return &ProjectService{db: db}
}

func (s *ProjectService) GetAll() ([]models.Proyecto, error) {
	rows, err := s.db.Query("SELECT ID_proyecto, Nombre_p, Descripcion, Github, Enlace, Created_At FROM PROYECTO ORDER BY ID_proyecto DESC")
	if err != nil {
		return nil, fmt.Errorf("error al obtener proyectos: %w", err)
	}
	defer rows.Close()

	projects := make([]models.Proyecto, 0)
	for rows.Next() {
		var p models.Proyecto
		var enlace sql.NullString
		if err := rows.Scan(&p.ID_proyecto, &p.Nombre_p, &p.Descripcion, &p.Github, &enlace, &p.CreatedAt); err != nil {
			return nil, err
		}
		if enlace.Valid {
			p.Enlace = enlace.String
		}
		projects = append(projects, p)
	}

	return projects, nil
}

func (s *ProjectService) GetByID(id int) (*models.Proyecto, error) {
	var p models.Proyecto
	var enlace sql.NullString
	row := s.db.QueryRow("SELECT ID_proyecto, Nombre_p, Descripcion, Github, Enlace, Created_At FROM PROYECTO WHERE ID_proyecto = ?", id)
	err := row.Scan(&p.ID_proyecto, &p.Nombre_p, &p.Descripcion, &p.Github, &enlace, &p.CreatedAt)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, errors.New("proyecto no encontrado")
		}
		return nil, err
	}
	if enlace.Valid {
		p.Enlace = enlace.String
	}

	return &p, nil
}

func (s *ProjectService) Create(p *models.Proyecto) error {
	if p.Nombre_p == "" || p.Descripcion == "" || p.Github == "" {
		return errors.New("los campos Nombre_p, Descripcion y Github son obligatorios")
	}

	result, err := s.db.Exec(
		"INSERT INTO PROYECTO (Nombre_p, Descripcion, Github, Enlace) VALUES (?, ?, ?, ?)",
		p.Nombre_p, p.Descripcion, p.Github, p.Enlace,
	)
	if err != nil {
		return fmt.Errorf("error al insertar proyecto: %w", err)
	}

	id, err := result.LastInsertId()
	if err == nil {
		p.ID_proyecto = int(id)
	}
	return nil
}

func (s *ProjectService) Update(id int, p *models.Proyecto) error {
	if p.Nombre_p == "" || p.Descripcion == "" || p.Github == "" {
		return errors.New("los campos Nombre_p, Descripcion y Github son obligatorios")
	}

	result, err := s.db.Exec(
		"UPDATE PROYECTO SET Nombre_p = ?, Descripcion = ?, Github = ?, Enlace = ? WHERE ID_proyecto = ?",
		p.Nombre_p, p.Descripcion, p.Github, p.Enlace, id,
	)
	if err != nil {
		return fmt.Errorf("error al actualizar proyecto: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil || rowsAffected == 0 {
		return errors.New("proyecto no encontrado o no modificado")
	}

	p.ID_proyecto = id
	return nil
}

func (s *ProjectService) Delete(id int) error {
	result, err := s.db.Exec("DELETE FROM PROYECTO WHERE ID_proyecto = ?", id)
	if err != nil {
		return fmt.Errorf("error al eliminar proyecto: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil || rowsAffected == 0 {
		return errors.New("proyecto no encontrado")
	}
	return nil
}

func (s *ProjectService) Count() (int, error) {
	var count int
	err := s.db.QueryRow("SELECT COUNT(*) FROM PROYECTO").Scan(&count)
	return count, err
}
