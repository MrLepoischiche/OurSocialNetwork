package handlers

import (
	"encoding/json"
	"net/http"

	"social-network/backend/pkg/models"
	"social-network/backend/pkg/services"
)

type PostHandlers struct {
	postService *services.PostService
}

func NewPostHandlers(postService *services.PostService) *PostHandlers {
	return &PostHandlers{postService: postService}
}

func (h *PostHandlers) CreatePostHandler(w http.ResponseWriter, r *http.Request) {
	var req models.CreatePostRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	userID := r.Context().Value("userID").(string)
	post, err := h.postService.CreatePost(userID, req.Content)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(post)
}

func (h *PostHandlers) GetPostsHandler(w http.ResponseWriter, r *http.Request) {
	posts, err := h.postService.GetPosts()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(posts)
}

func (h *PostHandlers) CreateCommentHandler(w http.ResponseWriter, r *http.Request) {
	var req models.CreateCommentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	userID := r.Context().Value("userID").(string)
	comment, err := h.postService.CreateComment(userID, req.PostID, req.Content)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(comment)
}
