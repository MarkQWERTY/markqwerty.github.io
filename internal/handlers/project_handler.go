package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"portfolio/internal/models"
	"portfolio/internal/services"
)

type ProjectHandler struct {
	projectService *services.ProjectService
}

func NewProjectHandler(projectService *services.ProjectService) *ProjectHandler {
	return &ProjectHandler{projectService: projectService}
}

func (h *ProjectHandler) HandleProjects(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	switch r.Method {
	case http.MethodGet:
		projects, err := h.projectService.GetAll()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}
		json.NewEncoder(w).Encode(projects)

	case http.MethodPost:
		var p models.Proyecto
		if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "Payload JSON inválido"})
			return
		}

		if err := h.projectService.Create(&p); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(p)

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]string{"error": "Método no permitido"})
	}
}

func (h *ProjectHandler) HandleProjectByID(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	idStr := strings.TrimPrefix(r.URL.Path, "/api/v1/projects/")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "ID de proyecto inválido"})
		return
	}

	switch r.Method {
	case http.MethodGet:
		p, err := h.projectService.GetByID(id)
		if err != nil {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}
		json.NewEncoder(w).Encode(p)

	case http.MethodPut, http.MethodPatch:
		var p models.Proyecto
		if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "Payload JSON inválido"})
			return
		}

		if err := h.projectService.Update(id, &p); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}
		json.NewEncoder(w).Encode(p)

	case http.MethodDelete:
		if err := h.projectService.Delete(id); err != nil {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"message": "Proyecto eliminado con éxito"})

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]string{"error": "Método no permitido"})
	}
}
