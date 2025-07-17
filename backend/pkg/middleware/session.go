package middleware

import (
	"context"
	"log"
	"net/http"
	"social-network/backend/pkg/config"
	"social-network/backend/pkg/db"
	"social-network/backend/pkg/models"
	"time"
)

// include session in context using the UUID in the header of the request
func SessionMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		sessionUUID := r.Header.Get(config.SessionUUIDHeaderKey)
		session, _ := db.GetSessionByUUID(sessionUUID)
		if session == nil || time.Now().After(session.ExpiresAt) {
			if session != nil {
				deleteSession(w, session)
			}
			next.ServeHTTP(w, r)
			return
		}
		ctx := context.WithValue(r.Context(), config.SessionCtxKey, session)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func deleteSession(w http.ResponseWriter, session *models.Session) {
	if err := db.DeleteSessionByUUID(session.UUID); err != nil {
		log.Printf("Error attempting to delete the session in db: %v", err)
	}
	w.Header().Add(config.SetSessionUUIDHeaderKey, "")
}
