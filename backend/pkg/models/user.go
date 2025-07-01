package models

import (
	"time"
)

type User struct {
	ID          string    `json:"id"`
	Email       string    `json:"email"`
	Password    string    `json:"-"`
	FirstName   string    `json:"firstName"`
	LastName    string    `json:"lastName"`
	DateOfBirth string    `json:"dateOfBirth"`
	Avatar      string    `json:"avatar,omitempty"`
	Nickname    string    `json:"nickname,omitempty"`
	AboutMe     string    `json:"aboutMe,omitempty"`
	IsPublic    bool      `json:"isPublic"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

type RegisterRequest struct {
	Email       string `json:"email" validate:"required,email"`
	Password    string `json:"password" validate:"required,min=8"`
	FirstName   string `json:"firstName" validate:"required"`
	LastName    string `json:"lastName" validate:"required"`
	DateOfBirth string `json:"dateOfBirth" validate:"required"`
	Avatar      string `json:"avatar,omitempty"`
	Nickname    string `json:"nickname,omitempty"`
	AboutMe     string `json:"aboutMe,omitempty"`
}

type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}
