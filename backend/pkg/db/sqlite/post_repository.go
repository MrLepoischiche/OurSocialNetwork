package sqlite

import (
	"database/sql"
	"social-network/backend/pkg/models"
)

type PostRepository struct {
	db *sql.DB
}

func NewPostRepository(db *sql.DB) *PostRepository {
	return &PostRepository{db: db}
}

func (r *PostRepository) Create(post *models.Post) error {
	_, err := r.db.Exec(
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
	rows, err := r.db.Query(`
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

func (r *PostRepository) CreateComment(comment *models.Comment) error {
	_, err := r.db.Exec(
		"INSERT INTO comments (id, post_id, author_id, content, created_at) VALUES (?, ?, ?, ?, ?)",
		comment.ID,
		comment.PostID,
		comment.AuthorID,
		comment.Content,
		comment.CreatedAt,
	)
	return err
}
