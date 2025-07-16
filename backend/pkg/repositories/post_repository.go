package repositories

import "social-network/backend/pkg/models"

type PostRepository interface {
	Create(post *models.Post) error
	GetAll() ([]models.Post, error)
	CreateComment(comment *models.Comment) error
}
