package models

import (
	"time"
)

// Session represents a user session in the system.
type Session struct {
	ID        int       `json:"id"`         // Unique identifier for the session
	UUID      string    `json:"uuid"`       // Unique identifier for the session
	UserID    string    `json:"user_id"`    // ID of the user associated with the session
	CreatedAt time.Time `json:"created_at"` // Creation time of the session
	ExpiresAt time.Time `json:"expires_at"` // Expiration time of the session
}
