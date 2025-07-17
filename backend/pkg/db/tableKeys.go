package db

type users struct {
	ID          string
	Email       string
	FirstName   string
	LastName    string
	DateOfBirth string
	Avatar      string
	Nickname    string
	AboutMe     string
	IsPublic    string
	CreatedAt   string
	UpdatedAt   string
}

type sessions struct {
	UUID      string
	UserID    string
	ExpiresAt string
}

type posts struct {
	ID        string
	AuthorID  string
	Author    string
	Content   string
	CreatedAt string
	UpdatedAt string
	Likes     string
	Comments  string
}

type comments struct {
	ID        string
	PostID    string
	AuthorID  string
	Content   string
	CreatedAt string
}

var TableKeys = struct {
	Users    users
	Sessions sessions
	Posts    posts
	Comments comments
}{
	Users: users{
		ID:          "id",
		Email:       "email",
		FirstName:   "first_name",
		LastName:    "last_name",
		DateOfBirth: "date_of_birth",
		Avatar:      "avatar",
		Nickname:    "nickname",
		AboutMe:     "about_me",
		IsPublic:    "is_public",
		CreatedAt:   "created_at",
		UpdatedAt:   "updated_at",
	},
	Sessions: sessions{
		UUID:      "uuid",
		UserID:    "user_id",
		ExpiresAt: "expires_at",
	},
	Posts: posts{
		ID:        "id",
		AuthorID:  "author_id",
		Author:    "author",
		Content:   "content",
		CreatedAt: "created_at",
		UpdatedAt: "updated_at",
		Likes:     "likes",
		Comments:  "comments",
	},
	Comments: comments{
		ID:        "id",
		PostID:    "post_id",
		AuthorID:  "author_id",
		Content:   "content",
		CreatedAt: "created_at",
	},
}
