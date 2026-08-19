package services

import (
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"

	"portfolio/internal/models"
)

type AuthService struct {
	db        *sql.DB
	jwtSecret []byte
}

func NewAuthService(db *sql.DB, secret string) *AuthService {
	return &AuthService{
		db:        db,
		jwtSecret: []byte(secret),
	}
}

type Claims struct {
	AdminID int    `json:"admin_id"`
	Nombre  string `json:"nombre"`
	jwt.RegisteredClaims
}

func (s *AuthService) Login(id int, password string) (*models.LoginResponse, error) {
	var admin models.Administrador
	row := s.db.QueryRow("SELECT Id, Password, Nombre, Apellidos, Created_At FROM ADMINISTRADOR WHERE Id = ?", id)
	err := row.Scan(&admin.ID, &admin.Password, &admin.Nombre, &admin.Apellidos, &admin.CreatedAt)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, errors.New("credenciales inválidas")
		}
		return nil, fmt.Errorf("error al consultar usuario: %w", err)
	}

	if err := bcrypt.CompareHashAndPassword([]byte(admin.Password), []byte(password)); err != nil {
		return nil, errors.New("credenciales inválidas")
	}

	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		AdminID: admin.ID,
		Nombre:  admin.Nombre,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(s.jwtSecret)
	if err != nil {
		return nil, fmt.Errorf("error al generar token JWT: %w", err)
	}

	return &models.LoginResponse{
		Token: tokenString,
		Admin: admin,
	}, nil
}

func (s *AuthService) GetAdminByID(id int) (*models.Administrador, error) {
	var admin models.Administrador
	row := s.db.QueryRow("SELECT Id, Nombre, Apellidos, Created_At FROM ADMINISTRADOR WHERE Id = ?", id)
	err := row.Scan(&admin.ID, &admin.Nombre, &admin.Apellidos, &admin.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &admin, nil
}

func (s *AuthService) ChangePassword(id int, oldPassword, newPassword string) error {
	var currentHashed string
	err := s.db.QueryRow("SELECT Password FROM ADMINISTRADOR WHERE Id = ?", id).Scan(&currentHashed)
	if err != nil {
		return errors.New("administrador no encontrado")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(currentHashed), []byte(oldPassword)); err != nil {
		return errors.New("la contraseña actual es incorrecta")
	}

	newHashed, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("error al procesar la nueva contraseña: %w", err)
	}

	_, err = s.db.Exec("UPDATE ADMINISTRADOR SET Password = ? WHERE Id = ?", string(newHashed), id)
	return err
}

func (s *AuthService) ValidateToken(tokenString string) (*Claims, error) {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("método de firma inesperado: %v", token.Header["alg"])
		}
		return s.jwtSecret, nil
	})

	if err != nil || !token.Valid {
		return nil, errors.New("token no válido o expirado")
	}

	return claims, nil
}
