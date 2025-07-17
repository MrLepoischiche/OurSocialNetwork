package repositories

import (
	"database/sql"
	"social-network/backend/pkg/models"
)

type PostRepository struct {
	repo repository
}

func NewPostRepository(db *sql.DB) *PostRepository {
	postRepo := &PostRepository{
		repo: repository{DB: db},
	}
	var _ repositoryMethods[models.Post] = postRepo // Ensure PostRepository implements repositoryMethods
	return postRepo
}

func (r *PostRepository) Create(post *models.Post) error {
	_, err := r.repo.DB.Exec(
		"INSERT INTO posts (id, author_id, content, created_at, updated_at, likes) VALUES (?, ?, ?, ?, ?, ?)",
		post.ID,
		post.AuthorID,
		post.Content,
		post.CreatedAt,
		post.UpdatedAt,
		post.Likes,
	)
	return err
}

func (r *PostRepository) GetAll() ([]models.Post, error) {
	rows, err := r.repo.DB.Query(`
		SELECT p.id, p.author_id, p.content, p.created_at, p.updated_at, p.likes,
		       u.id, u.first_name, u.last_name, u.avatar
		FROM posts p
		JOIN users u ON p.author_id = u.id
		ORDER BY p.created_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []models.Post
	for rows.Next() {
		var post models.Post
		var author models.User
		err := rows.Scan(
			&post.ID,
			&post.AuthorID,
			&post.Content,
			&post.CreatedAt,
			&post.UpdatedAt,
			&post.Likes,
			&author.ID,
			&author.FirstName,
			&author.LastName,
			&author.Avatar,
		)
		if err != nil {
			return nil, err
		}
		post.Author = author
		posts = append(posts, post)
	}

	return posts, nil
}

func (r *PostRepository) GetByID(id string) (*models.Post, error) {
	var post models.Post
	var author models.User
	err := r.repo.DB.QueryRow(`
		SELECT p.id, p.author_id, p.content, p.created_at, p.updated_at, p.likes,
		       u.id, u.first_name, u.last_name, u.avatar
		FROM posts p
		JOIN users u ON p.author_id = u.id
		WHERE p.id = ?`,
		id,
	).Scan(
		&post.ID,
		&post.AuthorID,
		&post.Content,
		&post.CreatedAt,
		&post.UpdatedAt,
		&post.Likes,
		&author.ID,
		&author.FirstName,
		&author.LastName,
		&author.Avatar,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	post.Author = author
	return &post, nil
}

func (r *PostRepository) CreateComment(comment *models.Comment) error {
	_, err := r.repo.DB.Exec(
		"INSERT INTO comments (id, post_id, author_id, content, created_at) VALUES (?, ?, ?, ?, ?)",
		comment.ID,
		comment.PostID,
		comment.AuthorID,
		comment.Content,
		comment.CreatedAt,
	)
	return err
}

func (r *PostRepository) Update(post *models.Post) error {
	_, err := r.repo.DB.Exec(`
		UPDATE posts 
		SET content = ?, updated_at = ?, likes = ?
		WHERE id = ?`,
		post.Content,
		post.UpdatedAt,
		post.Likes,
		post.ID,
	)
	return err
}

func (r *PostRepository) Delete(postID string) error {
	_, err := r.repo.DB.Exec("DELETE FROM posts WHERE id = ?", postID)
	return err
}
