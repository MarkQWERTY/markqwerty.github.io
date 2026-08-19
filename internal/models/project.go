package models

import "time"

type Proyecto struct {
	ID_proyecto int       `json:"id_proyecto"`
	Nombre_p    string    `json:"nombre_p"`
	Descripcion string    `json:"descripcion"`
	Github      string    `json:"github"`
	Enlace      string    `json:"enlace"`
	CreatedAt   time.Time `json:"created_at"`
}
