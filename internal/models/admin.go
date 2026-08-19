package models

import "time"

type Administrador struct {
	ID        int       `json:"id"`
	Password  string    `json:"-"`
	Nombre    string    `json:"nombre"`
	Apellidos string    `json:"apellidos"`
	CreatedAt time.Time `json:"created_at"`
}

type LoginRequest struct {
	ID       int    `json:"id"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string        `json:"token"`
	Admin Administrador `json:"admin"`
}

type ChangePasswordRequest struct {
	OldPassword string `json:"old_password"`
	NewPassword string `json:"new_password"`
}
