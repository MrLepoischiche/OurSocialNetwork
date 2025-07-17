package models

import (
	"time"
)

type Post struct {
	ID        string    `json:"id"`
	AuthorID  string    `json:"author_id"`
	Author    User      `json:"author"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Likes     int       `json:"likes"`
	Comments  []Comment `json:"comments,omitempty"`
}

type Comment struct {
	ID        string    `json:"id"`
	PostID    string    `json:"post_id"`
	AuthorID  string    `json:"author_id"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
}

type CreatePostRequest struct {
	Content string `json:"content" validate:"required"`
}

type CreateCommentRequest struct {
	PostID  string `json:"post_id" validate:"required"`
	Content string `json:"content" validate:"required"`
}
