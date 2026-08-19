package middleware

import (
	"context"
	"net/http"
	"strings"

	"portfolio/internal/services"
)

type contextKey string

const AdminIDKey contextKey = "adminID"

func AuthMiddleware(authService *services.AuthService) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			tokenString := ""

			// 1. Check Authorization header
			authHeader := r.Header.Get("Authorization")
			if strings.HasPrefix(authHeader, "Bearer ") {
				tokenString = strings.TrimPrefix(authHeader, "Bearer ")
			}

			// 2. Fallback to Cookie
			if tokenString == "" {
				cookie, err := r.Cookie("auth_token")
				if err == nil {
					tokenString = cookie.Value
				}
			}

			if tokenString == "" {
				http.Error(w, `{"error":"No autorizado, token requerido"}`, http.StatusUnauthorized)
				return
			}

			claims, err := authService.ValidateToken(tokenString)
			if err != nil {
				http.Error(w, `{"error":"Token inválido o expirado"}`, http.StatusUnauthorized)
				return
			}

			ctx := context.WithValue(r.Context(), AdminIDKey, claims.AdminID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
