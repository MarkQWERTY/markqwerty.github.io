package models

import "time"

type Formulario struct {
	ID_form   int       `json:"id_form"`
	Nombre    string    `json:"nombre"`
	Mail      string    `json:"mail"`
	Telefono  string    `json:"telefono"`
	Texto     string    `json:"texto"`
	CreatedAt time.Time `json:"created_at"`
}
