package services

import (
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"

	"portfolio/internal/db"
	"portfolio/internal/models"
)

type AuthService struct {
	db        *sql.DB
	jwtSecret []byte
	driver    string
}

func NewAuthService(database *sql.DB, secret string, driver string) *AuthService {
	return &AuthService{
		db:        database,
		jwtSecret: []byte(secret),
		driver:    driver,
	}
}

type Claims struct {
	AdminID int    `json:"admin_id"`
	Nombre  string `json:"nombre"`
	jwt.RegisteredClaims
}

func (s *AuthService) GenerateToken(admin *models.Administrador) (string, error) {
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
	return token.SignedString(s.jwtSecret)
}

func (s *AuthService) Login(id int, password string) (*models.LoginResponse, error) {
	var admin models.Administrador
	query := db.AdaptQuery("SELECT Id, Password, Nombre, Apellidos, Created_At FROM ADMINISTRADOR WHERE Id = ?", s.driver)
	row := s.db.QueryRow(query, id)
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

	tokenString, err := s.GenerateToken(&admin)
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
	query := db.AdaptQuery("SELECT Id, Nombre, Apellidos, Created_At FROM ADMINISTRADOR WHERE Id = ?", s.driver)
	row := s.db.QueryRow(query, id)
	err := row.Scan(&admin.ID, &admin.Nombre, &admin.Apellidos, &admin.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &admin, nil
}

func (s *AuthService) ChangeCredentials(id int, oldPassword, newPassword string, newID int) (string, error) {
	var admin models.Administrador
	query := db.AdaptQuery("SELECT Id, Password, Nombre, Apellidos, Created_At FROM ADMINISTRADOR WHERE Id = ?", s.driver)
	row := s.db.QueryRow(query, id)
	err := row.Scan(&admin.ID, &admin.Password, &admin.Nombre, &admin.Apellidos, &admin.CreatedAt)
	if err != nil {
		return "", errors.New("administrador no encontrado")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(admin.Password), []byte(oldPassword)); err != nil {
		return "", errors.New("la contraseña actual es incorrecta")
	}

	updatedPassword := admin.Password
	if newPassword != "" {
		newHashed, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
		if err != nil {
			return "", fmt.Errorf("error al procesar la nueva contraseña: %w", err)
		}
		updatedPassword = string(newHashed)
	}

	updatedID := admin.ID
	if newID > 0 && newID != admin.ID {
		var exists int
		checkQuery := db.AdaptQuery("SELECT COUNT(*) FROM ADMINISTRADOR WHERE Id = ?", s.driver)
		err = s.db.QueryRow(checkQuery, newID).Scan(&exists)
		if err == nil && exists > 0 {
			return "", errors.New("el nuevo ID ya está en uso")
		}
		updatedID = newID
	}

	if newPassword == "" && updatedID == admin.ID {
		return "", errors.New("debe proporcionar un nuevo ID o una nueva contraseña diferente")
	}

	updateQuery := db.AdaptQuery("UPDATE ADMINISTRADOR SET Id = ?, Password = ? WHERE Id = ?", s.driver)
	_, err = s.db.Exec(updateQuery, updatedID, updatedPassword, id)
	if err != nil {
		return "", fmt.Errorf("error al actualizar las credenciales: %w", err)
	}

	admin.ID = updatedID
	newToken, err := s.GenerateToken(&admin)
	if err != nil {
		return "", fmt.Errorf("error al generar el nuevo token: %w", err)
	}

	return newToken, nil
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
