package handlers

import (
	"html/template"
	"log"
	"net/http"
	"path/filepath"
	"strconv"
	"strings"

	"portfolio/internal/services"
)

type ViewHandler struct {
	projectService *services.ProjectService
	templateDir    string
}

func NewViewHandler(projectService *services.ProjectService, templateDir string) *ViewHandler {
	return &ViewHandler{
		projectService: projectService,
		templateDir:    templateDir,
	}
}

func (h *ViewHandler) RenderHome(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}

	projects, err := h.projectService.GetAll()
	if err != nil {
		log.Printf("Error retrieving projects for home: %v", err)
	}

	tmplPath := filepath.Join(h.templateDir, "index.html")
	tmpl, err := template.ParseFiles(tmplPath)
	if err != nil {
		http.Error(w, "Error cargando plantilla: "+err.Error(), http.StatusInternalServerError)
		return
	}

	data := map[string]interface{}{
		"Projects": projects,
	}

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	tmpl.Execute(w, data)
}

func (h *ViewHandler) RenderProjectDetail(w http.ResponseWriter, r *http.Request) {
	idStr := strings.TrimPrefix(r.URL.Path, "/projects/")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "ID de proyecto no válido", http.StatusBadRequest)
		return
	}

	project, err := h.projectService.GetByID(id)
	if err != nil {
		http.Error(w, "Proyecto no encontrado", http.StatusNotFound)
		return
	}

	tmplPath := filepath.Join(h.templateDir, "project_detail.html")
	tmpl, err := template.ParseFiles(tmplPath)
	if err != nil {
		http.Error(w, "Error cargando plantilla: "+err.Error(), http.StatusInternalServerError)
		return
	}

	data := map[string]interface{}{
		"Project": project,
	}

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	tmpl.Execute(w, data)
}

func (h *ViewHandler) RenderAdminLogin(w http.ResponseWriter, r *http.Request) {
	tmplPath := filepath.Join(h.templateDir, "admin_login.html")
	tmpl, err := template.ParseFiles(tmplPath)
	if err != nil {
		http.Error(w, "Error cargando plantilla: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	tmpl.Execute(w, nil)
}

func (h *ViewHandler) RenderAdminDashboard(w http.ResponseWriter, r *http.Request) {
	tmplPath := filepath.Join(h.templateDir, "admin_dashboard.html")
	tmpl, err := template.ParseFiles(tmplPath)
	if err != nil {
		http.Error(w, "Error cargando plantilla: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	tmpl.Execute(w, nil)
}
