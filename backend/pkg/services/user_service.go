package services

import (
	"social-network/backend/pkg/models"
	"social-network/backend/pkg/repositories"
)

type UserService struct {
	userRepo *repositories.UserRepository
}

func NewUserService(userRepo *repositories.UserRepository) *UserService {
	return &UserService{userRepo: userRepo}
}

func (s *UserService) GetUserProfile(userID string) (*models.User, error) {
	return s.userRepo.GetByID(userID)
}

func (s *UserService) GetUserPosts(userID string) ([]models.Post, error) {
	// TODO: Implement fetching posts by userID
	return nil, nil
}

func (s *UserService) GetUserFollowers(userID string) ([]models.User, error) {
	return s.userRepo.GetFollowers(userID)
}

func (s *UserService) GetUserFollowing(userID string) ([]models.User, error) {
	return s.userRepo.GetFollowing(userID)
}

func (s *UserService) UpdateUserPrivacy(userID string, isPublic bool) error {
	user, err := s.userRepo.GetByID(userID)
	if err != nil {
		return err
	}
	user.IsPublic = isPublic
	return s.userRepo.Update(user)
}

func (s *UserService) IsFollower(userID string, followerID string) bool {
	followers, err := s.userRepo.GetFollowers(userID)
	if err != nil {
		return false
	}
	for _, follower := range followers {
		if follower.ID == followerID {
			return true
		}
	}
	return false
}
