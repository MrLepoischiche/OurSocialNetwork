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
		user.Avatar = "https://avatar.iran.liara.run/public/boy" // Temporary placeholder
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
	userID, ok := r.Context().Value("userID").(string)
	if !ok || userID == "" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
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
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Authorization header required", http.StatusUnauthorized)
			return
		}

		// Expect header format: "Bearer <token>"
		const prefix = "Bearer "
		if len(authHeader) <= len(prefix) || authHeader[:len(prefix)] != prefix {
			http.Error(w, "Invalid authorization header format", http.StatusUnauthorized)
			return
		}
		tokenString := authHeader[len(prefix):]

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

// UpdateProfileHandler handles updating user profile including avatar upload
func (h *AuthHandlers) UpdateProfileHandler(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("userID").(string)
	if !ok || userID == "" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	if err := r.ParseMultipartForm(32 << 20); err != nil {
		http.Error(w, "Failed to parse form data", http.StatusBadRequest)
		return
	}

	form := r.MultipartForm.Value
	getField := func(field string) string {
		if values, exists := form[field]; exists && len(values) > 0 {
			return values[0]
		}
		return ""
	}

	updatedUser := &models.User{
		ID:          userID,
		FirstName:   getField("firstName"),
		LastName:    getField("lastName"),
		Nickname:    getField("nickname"),
		Email:       getField("email"),
		AboutMe:     getField("aboutMe"),
		DateOfBirth: getField("dateOfBirth"),
	}

	password := getField("password")

	// Handle avatar file if uploaded
	if avatarFile, _, err := r.FormFile("avatar"); err == nil {
		defer avatarFile.Close()
		// For simplicity, we can save the avatar URL as a placeholder or handle file saving here
		// In a real app, you would save the file and generate a URL
		updatedUser.Avatar = "https://avatar.iran.liara.run/public/boy" // Placeholder
	}

	err := h.authService.UpdateProfile(updatedUser, password)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Return updated user without password
	updatedUser.Password = ""
	json.NewEncoder(w).Encode(updatedUser)
}
