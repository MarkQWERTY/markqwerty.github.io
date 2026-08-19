package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"portfolio/internal/models"
	"portfolio/internal/services"
)

type ContactHandler struct {
	contactService *services.ContactService
	projectService *services.ProjectService
}

func NewContactHandler(contactService *services.ContactService, projectService *services.ProjectService) *ContactHandler {
	return &ContactHandler{
		contactService: contactService,
		projectService: projectService,
	}
}

func (h *ContactHandler) HandleSubmissions(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	switch r.Method {
	case http.MethodPost:
		var c models.Formulario
		if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "Payload JSON inválido"})
			return
		}

		if err := h.contactService.Create(&c); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"message": "Formulario de contacto recibido con éxito",
			"data":    c,
		})

	case http.MethodGet:
		submissions, err := h.contactService.GetAll()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}
		json.NewEncoder(w).Encode(submissions)

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]string{"error": "Método no permitido"})
	}
}

func (h *ContactHandler) HandleSubmissionByID(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	idStr := strings.TrimPrefix(r.URL.Path, "/api/v1/contact-submissions/")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "ID de formulario inválido"})
		return
	}

	switch r.Method {
	case http.MethodGet:
		submission, err := h.contactService.GetByID(id)
		if err != nil {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}
		json.NewEncoder(w).Encode(submission)

	case http.MethodDelete:
		if err := h.contactService.Delete(id); err != nil {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"message": "Mensaje eliminado con éxito"})

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]string{"error": "Método no permitido"})
	}
}

func (h *ContactHandler) GetStats(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]string{"error": "Método no permitido"})
		return
	}

	projectsCount, _ := h.projectService.Count()
	messagesCount, _ := h.contactService.Count()

	json.NewEncoder(w).Encode(map[string]interface{}{
		"total_projects": projectsCount,
		"total_messages": messagesCount,
	})
}
