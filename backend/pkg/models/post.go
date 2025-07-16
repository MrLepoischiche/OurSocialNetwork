package models

import (
	"time"
)

type Post struct {
	ID        string    `json:"id"`
	AuthorID  string    `json:"authorId"`
	Author    User      `json:"author"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	Likes     int       `json:"likes"`
	Comments  []Comment `json:"comments,omitempty"`
}

type Comment struct {
	ID        string    `json:"id"`
	PostID    string    `json:"postId"`
	AuthorID  string    `json:"authorId"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"createdAt"`
}

type CreatePostRequest struct {
	Content string `json:"content" validate:"required"`
}

type CreateCommentRequest struct {
	PostID  string `json:"postId" validate:"required"`
	Content string `json:"content" validate:"required"`
}
