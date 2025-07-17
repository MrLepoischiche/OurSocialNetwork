package services

import (
	"social-network/backend/pkg/models"
	"social-network/backend/pkg/repositories"
	"time"
)

type PostService struct {
	postRepo *repositories.PostRepository
}

func NewPostService(postRepo *repositories.PostRepository) *PostService {
	return &PostService{postRepo: postRepo}
}

func (s *PostService) CreatePost(authorID, content string) (*models.Post, error) {
	post := &models.Post{
		AuthorID:  authorID,
		Content:   content,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
		Likes:     0,
	}

	if err := s.postRepo.Create(post); err != nil {
		return nil, err
	}

	return post, nil
}

func (s *PostService) GetPosts() ([]models.Post, error) {
	return s.postRepo.GetAll()
}

func (s *PostService) CreateComment(authorID, postID, content string) (*models.Comment, error) {
	comment := &models.Comment{
		PostID:    postID,
		AuthorID:  authorID,
		Content:   content,
		CreatedAt: time.Now(),
	}

	if err := s.postRepo.CreateComment(comment); err != nil {
		return nil, err
	}

	return comment, nil
}
