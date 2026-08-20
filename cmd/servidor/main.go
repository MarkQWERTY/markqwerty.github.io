package main

import (
	"log"
	"net/http"
	"path/filepath"

	"portfolio/internal/config"
	"portfolio/internal/db"
	"portfolio/internal/handlers"
	"portfolio/internal/middleware"
	"portfolio/internal/services"
)

func main() {
	cfg := config.LoadConfig()

	database, err := db.InitDB(cfg)
	if err != nil {
		log.Fatalf("Fatal error initializing database: %v", err)
	}
	defer database.Close()

	// Services
	authService := services.NewAuthService(database, cfg.JWTSecret)
	projectService := services.NewProjectService(database)
	contactService := services.NewContactService(database)

	// Handlers
	authHandler := handlers.NewAuthHandler(authService)
	projectHandler := handlers.NewProjectHandler(projectService)
	contactHandler := handlers.NewContactHandler(contactService, projectService)
	cvHandler := handlers.NewCVHandler(filepath.Join("web", "static"))
	viewHandler := handlers.NewViewHandler(projectService, filepath.Join("web", "templates"))

	// Middlewares
	authMiddleware := middleware.AuthMiddleware(authService)

	mux := http.NewServeMux()

	// Static Files
	fs := http.FileServer(http.Dir(filepath.Join("web", "static")))
	mux.Handle("/static/", http.StripPrefix("/static/", fs))
	mux.Handle("/web/static/", http.StripPrefix("/web/static/", fs))

	// Favicon and SEO direct routes
	mux.HandleFunc("/favicon.ico", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, filepath.Join("web", "static", "img", "favicon", "favicon.ico"))
	})
	mux.HandleFunc("/robots.txt", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		http.ServeFile(w, r, filepath.Join("web", "static", "robots.txt"))
	})
	mux.HandleFunc("/sitemap.xml", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/xml; charset=utf-8")
		http.ServeFile(w, r, filepath.Join("web", "static", "sitemap.xml"))
	})

	// HTML Views
	mux.HandleFunc("/", viewHandler.RenderHome)
	mux.HandleFunc("/projects/", viewHandler.RenderProjectDetail)
	mux.HandleFunc("/admin/login", viewHandler.RenderAdminLogin)
	mux.HandleFunc("/admin", viewHandler.RenderAdminDashboard)

	// REST API Public Endpoints
	mux.HandleFunc("/api/v1/auth/login", authHandler.Login)
	mux.HandleFunc("/api/v1/projects", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			projectHandler.HandleProjects(w, r)
		} else {
			authMiddleware(http.HandlerFunc(projectHandler.HandleProjects)).ServeHTTP(w, r)
		}
	})
	mux.HandleFunc("/api/v1/projects/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			projectHandler.HandleProjectByID(w, r)
		} else {
			authMiddleware(http.HandlerFunc(projectHandler.HandleProjectByID)).ServeHTTP(w, r)
		}
	})
	mux.HandleFunc("/api/v1/contact-submissions", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			contactHandler.HandleSubmissions(w, r)
		} else {
			authMiddleware(http.HandlerFunc(contactHandler.HandleSubmissions)).ServeHTTP(w, r)
		}
	})
	mux.HandleFunc("/api/v1/contact-submissions/", authMiddleware(http.HandlerFunc(contactHandler.HandleSubmissionByID)).ServeHTTP)

	// REST API Protected Endpoints
	mux.Handle("/api/v1/auth/logout", authMiddleware(http.HandlerFunc(authHandler.Logout)))
	mux.Handle("/api/v1/auth/me", authMiddleware(http.HandlerFunc(authHandler.Me)))
	mux.Handle("/api/v1/auth/password", authMiddleware(http.HandlerFunc(authHandler.ChangePassword)))
	mux.Handle("/api/v1/dashboard/stats", authMiddleware(http.HandlerFunc(contactHandler.GetStats)))
	mux.HandleFunc("/api/v1/cv/status", cvHandler.GetStatus)
	mux.Handle("/api/v1/cv", authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			cvHandler.UploadCV(w, r)
		} else if r.Method == http.MethodDelete {
			cvHandler.DeleteCV(w, r)
		} else {
			http.Error(w, `{"error":"Método no permitido"}`, http.StatusMethodNotAllowed)
		}
	})))

	log.Printf("Server running and listening on http://localhost:%s", cfg.Port)
	if err := http.ListenAndServe(":"+cfg.Port, mux); err != nil {
		log.Fatalf("Server stopped: %v", err)
	}
}
