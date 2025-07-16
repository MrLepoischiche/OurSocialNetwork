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

func (r *UserRepository) Update(user *models.User) error {
	_, err := r.db.Exec(`
		UPDATE users SET
			email = ?,
			first_name = ?,
			last_name = ?,
			date_of_birth = ?,
			avatar = ?,
			nickname = ?,
			about_me = ?,
			is_public = ?,
			updated_at = CURRENT_TIMESTAMP
		WHERE id = ?`,
		user.Email,
		user.FirstName,
		user.LastName,
		user.DateOfBirth,
		user.Avatar,
		user.Nickname,
		user.AboutMe,
		user.IsPublic,
		user.ID,
	)
	return err
}

func (r *UserRepository) GetFollowers(userID string) ([]models.User, error) {
	rows, err := r.db.Query(`
		SELECT u.id, u.email, u.first_name, u.last_name, u.date_of_birth, u.avatar, u.nickname, u.about_me, u.is_public, u.created_at, u.updated_at
		FROM followers f
		JOIN users u ON f.follower_id = u.id
		WHERE f.following_id = ? AND f.status = 'accepted'
	`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var followers []models.User
	for rows.Next() {
		var user models.User
		err := rows.Scan(
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
			return nil, err
		}
		followers = append(followers, user)
	}

	return followers, nil
}

func (r *UserRepository) GetFollowing(userID string) ([]models.User, error) {
	rows, err := r.db.Query(`
		SELECT u.id, u.email, u.first_name, u.last_name, u.date_of_birth, u.avatar, u.nickname, u.about_me, u.is_public, u.created_at, u.updated_at
		FROM followers f
		JOIN users u ON f.following_id = u.id
		WHERE f.follower_id = ? AND f.status = 'accepted'
	`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var following []models.User
	for rows.Next() {
		var user models.User
		err := rows.Scan(
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
			return nil, err
		}
		following = append(following, user)
	}

	return following, nil
}
