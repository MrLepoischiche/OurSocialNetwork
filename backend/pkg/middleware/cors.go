package middleware

import (
	"log"
	"net/http"
	"social-network/backend/pkg/config"
	"social-network/backend/pkg/utils"
)

// allow requests from the website
func CorsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		if origin != config.WebsiteOrigin {
			log.Printf("Request origin '%s' is not allowed", origin)
			httpErr := utils.NewHTTPError("Forbidden")
			utils.JSONResponse(w, httpErr, http.StatusForbidden)
			return
		}

		// TODO: use an api secret token to make sure that it is the website server

		// do not apply CORS on WebSocket
		if r.Header.Get("Upgrade") == "websocket" {
			next.ServeHTTP(w, r)
			return
		}

		// CORS headers
		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			utils.JSONResponse(w, nil, http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}
