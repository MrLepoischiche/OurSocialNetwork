package handlers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	"social-network/backend/pkg/models"
	"social-network/backend/pkg/services"
)

type AuthHandlers struct {
	authService *services.AuthService
}

func NewAuthHandlers(authService *services.AuthService) *AuthHandlers {
	return &AuthHandlers{authService: authService}
}

func (h *AuthHandlers) RegisterHandler(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseMultipartForm(32 << 20); err != nil {
		log.Printf("Failed to parse multipart form: %v", err)
		http.Error(w, "Failed to parse form data", http.StatusBadRequest)
		return
	}
	log.Printf("Received registration form with fields: %+v", r.MultipartForm.Value)

	form := r.MultipartForm.Value
	// Safely handle optional fields
	getField := func(field string) string {
		if values, exists := form[field]; exists && len(values) > 0 {
			return values[0]
		}
		return ""
	}

	user := &models.User{
		Email:       getField("email"),
		Password:    getField("password"),
		FirstName:   getField("firstName"),
		LastName:    getField("lastName"),
		DateOfBirth: getField("dateOfBirth"),
		Nickname:    getField("nickname"),
		AboutMe:     getField("aboutMe"),
	}

	if avatarFile, _, err := r.FormFile("avatar"); err == nil {
		defer avatarFile.Close()
		// Handle avatar file upload here if needed
		user.Avatar = "avatar_placeholder.jpg" // Temporary placeholder
	}

	if err := h.authService.Register(user); err != nil {
		log.Printf("Registration failed: %v", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	log.Printf("Successfully registered user: %s", user.Email)

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "User registered successfully"})
}

func (h *AuthHandlers) LoginHandler(w http.ResponseWriter, r *http.Request) {
	var req models.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	token, err := h.authService.Login(req.Email, req.Password)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"token": token})
}

func (h *AuthHandlers) MeHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("userID").(string)
	user, err := h.authService.GetCurrentUser(userID)
	if err != nil {
		http.Error(w, "Failed to get user data", http.StatusInternalServerError)
		return
	}

	// Don't return sensitive data
	user.Password = ""
	json.NewEncoder(w).Encode(user)
}

func (h *AuthHandlers) AuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tokenString := r.Header.Get("Authorization")
		if tokenString == "" {
			http.Error(w, "Authorization header required", http.StatusUnauthorized)
			return
		}

		userID, err := h.authService.ValidateToken(tokenString)
		if err != nil {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		// Add userID to request context
		ctx := context.WithValue(r.Context(), "userID", userID)
		next(w, r.WithContext(ctx))
	}
}
