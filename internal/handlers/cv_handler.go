package handlers

import (
	"encoding/json"
	"io"
	"net/http"
	"os"
	"path/filepath"
)

type CVHandler struct {
	storageDir string
}

func NewCVHandler(storageDir string) *CVHandler {
	return &CVHandler{storageDir: storageDir}
}

type CVStatusResponse struct {
	Exists   bool   `json:"exists"`
	Filename string `json:"filename,omitempty"`
	URL      string `json:"url,omitempty"`
}

func (h *CVHandler) GetStatus(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]string{"error": "Método no permitido"})
		return
	}

	cvPath := filepath.Join(h.storageDir, "cv.pdf")
	_, err := os.Stat(cvPath)
	exists := !os.IsNotExist(err)

	resp := CVStatusResponse{
		Exists: exists,
	}
	if exists {
		resp.Filename = "cv.pdf"
		resp.URL = "/static/cv.pdf"
	}

	json.NewEncoder(w).Encode(resp)
}

func (h *CVHandler) UploadCV(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]string{"error": "Método no permitido"})
		return
	}

	// Limit upload size to 10MB
	r.Body = http.MaxBytesReader(w, r.Body, 10<<20)
	if err := r.ParseMultipartForm(10 << 20); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "El archivo excede el tamaño máximo permitido (10MB)"})
		return
	}

	file, header, err := r.FormFile("cv")
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "No se encontró ningún archivo con el campo 'cv'"})
		return
	}
	defer file.Close()

	// Validate PDF extension or content type
	ext := filepath.Ext(header.Filename)
	if ext != ".pdf" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Solo se permiten archivos en formato PDF (.pdf)"})
		return
	}

	if err := os.MkdirAll(h.storageDir, 0755); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Error creando directorio de almacenamiento"})
		return
	}

	dstPath := filepath.Join(h.storageDir, "cv.pdf")
	dst, err := os.Create(dstPath)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Error al guardar el archivo en el servidor"})
		return
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Error al escribir los datos del archivo"})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message":  "CV subido exitosamente",
		"filename": "cv.pdf",
		"url":      "/static/cv.pdf",
	})
}

func (h *CVHandler) DeleteCV(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != http.MethodDelete {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]string{"error": "Método no permitido"})
		return
	}

	cvPath := filepath.Join(h.storageDir, "cv.pdf")
	if err := os.Remove(cvPath); err != nil {
		if os.IsNotExist(err) {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(map[string]string{"error": "No hay ningún archivo de CV para eliminar"})
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Error al eliminar el archivo de CV"})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "CV eliminado exitosamente",
	})
}
