package services

import (
	"errors"
	"time"

	"social-network/backend/pkg/models"
	"social-network/backend/pkg/repositories"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	userRepo *repositories.UserRepository
	jwtKey   []byte
}

func NewAuthService(userRepo *repositories.UserRepository, jwtKey string) *AuthService {
	return &AuthService{
		userRepo: userRepo,
		jwtKey:   []byte(jwtKey),
	}
}

func (s *AuthService) Register(user *models.User) error {
	// Check if user already exists
	existingUser, err := s.userRepo.GetByEmail(user.Email)
	if err != nil {
		return err
	}
	if existingUser != nil {
		return errors.New("user already exists")
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.Password = string(hashedPassword)

	// Generate UUID for new user
	user.ID = uuid.New().String()
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()
	user.IsPublic = true // Default to public profile

	// Create user
	return s.userRepo.Create(user)
}

func (s *AuthService) Login(email, password string) (string, error) {
	// Get user by email
	user, err := s.userRepo.GetByEmail(email)
	if err != nil {
		return "", err
	}
	if user == nil {
		return "", errors.New("invalid credentials")
	}

	// Check password
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return "", errors.New("invalid credentials")
	}

	// Generate JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.ID,
		"exp": time.Now().Add(time.Hour * 24).Unix(),
	})

	return token.SignedString(s.jwtKey)
}

func (s *AuthService) ValidateToken(tokenString string) (string, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return s.jwtKey, nil
	})

	if err != nil {
		return "", err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims["sub"].(string), nil
	}

	return "", errors.New("invalid token")
}

func (s *AuthService) GetCurrentUser(userID string) (*models.User, error) {
	return s.userRepo.GetByID(userID)
}

// UpdateProfile updates user profile fields and password if provided
func (s *AuthService) UpdateProfile(updatedUser *models.User, newPassword string) error {
	// Get existing user
	user, err := s.userRepo.GetByID(updatedUser.ID)
	if err != nil {
		return err
	}
	if user == nil {
		return errors.New("user not found")
	}

	// Update fields if provided
	if updatedUser.FirstName != "" {
		user.FirstName = updatedUser.FirstName
	}
	if updatedUser.LastName != "" {
		user.LastName = updatedUser.LastName
	}
	if updatedUser.Nickname != "" {
		user.Nickname = updatedUser.Nickname
	}
	if updatedUser.Email != "" {
		user.Email = updatedUser.Email
	}
	if updatedUser.AboutMe != "" {
		user.AboutMe = updatedUser.AboutMe
	}
	if updatedUser.DateOfBirth != "" {
		user.DateOfBirth = updatedUser.DateOfBirth
	}
	if updatedUser.Avatar != "" {
		user.Avatar = updatedUser.Avatar
	}

	// Update password if provided
	if newPassword != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
		if err != nil {
			return err
		}
		user.Password = string(hashedPassword)
	}

	user.UpdatedAt = time.Now()

	// Save updated user
	return s.userRepo.Update(user)
}
