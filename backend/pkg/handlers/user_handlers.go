package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"social-network/backend/pkg/services"
)

type UserHandlers struct {
	userService *services.UserService
}

func NewUserHandlers(userService *services.UserService) *UserHandlers {
	return &UserHandlers{userService: userService}
}

// GetUserProfileHandler handles GET /api/users/{id}
func (h *UserHandlers) GetUserProfileHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]
	// userID, err := strconv.Atoi(idStr)
	userID := idStr
	// if err != nil {
	// 	http.Error(w, "Invalid user id", http.StatusBadRequest)
	// 	return
	// }

	// Get user profile info
	userProfile, err := h.userService.GetUserProfile(userID)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Check privacy and authorization
	authUserID := h.getAuthUserID(r)
	// if userProfile.IsPrivate && authUserID != userID && !h.userService.IsFollower(userID, authUserID) {
	if !userProfile.IsPublic && authUserID != userID && !h.userService.IsFollower(userID, authUserID) {
		http.Error(w, "Profile is private", http.StatusForbidden)
		return
	}

	json.NewEncoder(w).Encode(userProfile)
}

// GetUserPostsHandler handles GET /api/users/{id}/posts
func (h *UserHandlers) GetUserPostsHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]
	// userID, err := strconv.Atoi(idStr)
	userID := idStr
	// if err != nil {
	// 	http.Error(w, "Invalid user id", http.StatusBadRequest)
	// 	return
	// }

	posts, err := h.userService.GetUserPosts(userID)
	if err != nil {
		http.Error(w, "Failed to get posts", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(posts)
}

// GetUserFollowersHandler handles GET /api/users/{id}/followers
func (h *UserHandlers) GetUserFollowersHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]
	// userID, err := strconv.Atoi(idStr)
	userID := idStr
	// if err != nil {
	// 	http.Error(w, "Invalid user id", http.StatusBadRequest)
	// 	return
	// }

	followers, err := h.userService.GetUserFollowers(userID)
	if err != nil {
		http.Error(w, "Failed to get followers", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(followers)
}

// GetUserFollowingHandler handles GET /api/users/{id}/following
func (h *UserHandlers) GetUserFollowingHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]
	// userID, err := strconv.Atoi(idStr)
	userID := idStr
	// if err != nil {
	// 	http.Error(w, "Invalid user id", http.StatusBadRequest)
	// 	return
	// }

	following, err := h.userService.GetUserFollowing(userID)
	if err != nil {
		http.Error(w, "Failed to get following", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(following)
}

// UpdateUserPrivacyHandler handles PUT /api/users/{id}/privacy
func (h *UserHandlers) UpdateUserPrivacyHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]
	// userID, err := strconv.Atoi(idStr)
	userID := idStr
	// if err != nil {
	// 	http.Error(w, "Invalid user id", http.StatusBadRequest)
	// 	return
	// }

	authUserID := h.getAuthUserID(r)
	if authUserID != userID {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	type PrivacyUpdate struct {
		IsPublic bool `json:"isPublic"`
	}

	var privacyUpdate PrivacyUpdate
	err := json.NewDecoder(r.Body).Decode(&privacyUpdate)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	err = h.userService.UpdateUserPrivacy(userID, privacyUpdate.IsPublic)
	if err != nil {
		http.Error(w, "Failed to update privacy", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// Helper to get authenticated user ID from request context or token
func (h *UserHandlers) getAuthUserID(r *http.Request) string {
	userID, ok := r.Context().Value("userID").(string)
	if !ok {
		return ""
	}
	return userID
}
