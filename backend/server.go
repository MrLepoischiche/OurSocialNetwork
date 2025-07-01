package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"social-network/backend/pkg/db/sqlite"
	"social-network/backend/pkg/handlers"
	"social-network/backend/pkg/repositories"
	"social-network/backend/pkg/services"
)

func main() {
	// Initialize database
	db, err := sqlite.NewDatabase("./social-network.db")
	if err != nil {
		log.Fatal("Failed to initialize database:", err)
	}
	defer db.Close()

	// Apply migrations
	if err := db.ApplyMigrations("./pkg/db/migrations/sqlite"); err != nil {
		log.Fatal("Failed to apply migrations:", err)
	}

	// Initialize services
	userRepo := repositories.NewUserRepository(db.DB)
	authService := services.NewAuthService(userRepo, os.Getenv("JWT_SECRET"))
	authHandlers := handlers.NewAuthHandlers(authService)

	// Set up routes
	router := http.NewServeMux()
	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Social Network Backend")
	})

	// Auth routes
	router.HandleFunc("/api/auth/register", authHandlers.RegisterHandler)
	router.HandleFunc("/api/auth/login", authHandlers.LoginHandler)

	// Protected test route
	router.HandleFunc("/api/protected", authHandlers.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "This is a protected endpoint")
	}))

	// CORS middleware
	corsHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		router.ServeHTTP(w, r)
	})

	// Start server
	port := ":8080"
	if envPort := os.Getenv("PORT"); envPort != "" {
		port = ":" + envPort
	}
	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(port, corsHandler))
}
