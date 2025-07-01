package repositories

import (
	"database/sql"
	"social-network/backend/pkg/models"
)

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) Create(user *models.User) error {
	_, err := r.db.Exec(`
		INSERT INTO users (
			id, email, password, first_name, last_name, 
			date_of_birth, avatar, nickname, about_me, is_public
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		user.ID,
		user.Email,
		user.Password,
		user.FirstName,
		user.LastName,
		user.DateOfBirth,
		user.Avatar,
		user.Nickname,
		user.AboutMe,
		user.IsPublic,
	)
	return err
}

func (r *UserRepository) GetByEmail(email string) (*models.User, error) {
	var user models.User
	err := r.db.QueryRow(`
		SELECT 
			id, email, password, first_name, last_name,
			date_of_birth, avatar, nickname, about_me, is_public,
			created_at, updated_at
		FROM users 
		WHERE email = ?`,
		email,
	).Scan(
		&user.ID,
		&user.Email,
		&user.Password,
		&user.FirstName,
		&user.LastName,
		&user.DateOfBirth,
		&user.Avatar,
		&user.Nickname,
		&user.AboutMe,
		&user.IsPublic,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return &user, nil
}

func (r *UserRepository) GetByID(id string) (*models.User, error) {
	var user models.User
	err := r.db.QueryRow(`
		SELECT 
			id, email, first_name, last_name,
			date_of_birth, avatar, nickname, about_me, is_public,
			created_at, updated_at
		FROM users 
		WHERE id = ?`,
		id,
	).Scan(
		&user.ID,
		&user.Email,
		&user.FirstName,
		&user.LastName,
		&user.DateOfBirth,
		&user.Avatar,
		&user.Nickname,
		&user.AboutMe,
		&user.IsPublic,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return &user, nil
}
