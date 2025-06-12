

import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Divider,
  IconButton,
  Container,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  InputAdornment,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";

import {
  Search as SearchIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

import Header from "../header/header";
import HeaderPublic from "../header/header_public";
import AppFooter from "../footer/footer";
import ImageIcon from "@mui/icons-material/Image";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import CloseIcon from "@mui/icons-material/Close";
// import IconButton from '@mui/material/IconButton';

const API_BASE_URL = "http://localhost:8000/sushtiti";

function JobPosts() {
  // User state
  const [currentUser, setCurrentUser] = useState(null);
  const accessToken = localStorage.getItem("accessToken");

  // Post states
  const [posts, setPosts] = useState([]);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [newPost, setNewPost] = useState({ title: "", content: "" });

  // Edit states
  const [editingPost, setEditingPost] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedContent, setEditedContent] = useState({
    title: "",
    content: "",
  });

  // Comment states
  const [newComments, setNewComments] = useState({});

  // UI states
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  // Confirmation dialog states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState(null);
  const [confirmationData, setConfirmationData] = useState(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Initial data fetch
  useEffect(() => {
    fetchCurrentUser();
    fetchPosts();
  }, []);

  // API Functions
  const fetchCurrentUser = async () => {
    if (!accessToken) return;

    try {
      const response = await fetch(`${API_BASE_URL}/account/auth/user/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData);
        localStorage.setItem("userId", userData.id);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      showSnackbar("Failed to fetch user data", "error");
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/community/api/posts/public/list/`
      );
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      showSnackbar("Failed to load posts", "error");
    }
  };

  // Confirmation Dialog Handlers
  const openConfirmDialog = (type, data) => {
    setConfirmType(type);
    setConfirmationData(data);
    setConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
    setConfirmType(null);
    setConfirmationData(null);
  };

  const getConfirmationContent = () => {
    switch (confirmType) {
      case "createPost":
        return "Are you sure you want to create this post?";
      case "editPost":
        return "Are you sure you want to save these changes to the post?";
      case "deletePost":
        return "Are you sure you want to delete this post? This action cannot be undone.";
      case "createComment":
        return "Are you sure you want to post this comment?";
      case "editComment":
        return "Are you sure you want to save these changes to the comment?";
      case "deleteComment":
        return "Are you sure you want to delete this comment? This action cannot be undone.";
      default:
        return "Are you sure you want to proceed?";
    }
  };

  // Post Operations
  const createPost = () => {
    if (!accessToken) {
      showSnackbar("Please login to create a post", "error");
      return;
    }
    openConfirmDialog("createPost");
  };


  const handleConfirmCreatePost = async () => {
    try {
      const formData = new FormData();
      formData.append("title", newPost.title);
      formData.append("content", newPost.content);
      formData.append("typePost", newPost.typePost);
      formData.append("author", currentUser.id);

      if (newPost.image) {
        formData.append("image", newPost.image);
      }

      if (newPost.video) {
        formData.append("video", newPost.video);
      }

      const response = await fetch(`${API_BASE_URL}/community/api/posts/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        const createdPost = await response.json();
        setPosts([{ post: createdPost, comments: [] }, ...posts]);

        // Reset the form
        setNewPost({
          title: "",
          content: "",
          typePost: "",
          image: null,
          video: null,
        });
        showSnackbar("Post created successfully!");
      } else {
        showSnackbar("Failed to create post", "error");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      showSnackbar("Failed to create post", "error");
    }

    handleConfirmClose();
  };

  const updatePost = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/community/api/posts/${editingPost.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(editedContent),
        }
      );

      if (response.ok) {
        const updatedPost = await response.json();
        setPosts(
          posts.map((post) =>
            post.post.id === editingPost.id
              ? { ...post, post: updatedPost }
              : post
          )
        );
        setEditDialogOpen(false);
        setEditingPost(null);
        showSnackbar("Post updated successfully!");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      showSnackbar("Failed to update post", "error");
    }
    handleConfirmClose();
  };

  const deletePost = async (postId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/community/api/posts/${postId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        setPosts(posts.filter((post) => post.post.id !== postId));
        showSnackbar("Post deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      showSnackbar("Failed to delete post", "error");
    }
    handleConfirmClose();
  };

  // Comment Operations
  const createComment = async (postId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/community/api/posts/${postId}/comments/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            post: postId,
            text: newComments[postId],
            user: currentUser.id,
          }),
        }
      );

      if (response.ok) {
        const newComment = await response.json();
        setPosts(
          posts.map((post) =>
            post.post.id === postId
              ? { ...post, comments: [...post.comments, newComment] }
              : post
          )
        );
        setNewComments({ ...newComments, [postId]: "" });
        showSnackbar("Comment added successfully!");
      }
    } catch (error) {
      console.error("Error creating comment:", error);
      showSnackbar("Failed to add comment", "error");
    }
    handleConfirmClose();
  };

  const updateComment = async (postId, commentId, newText) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/community/api/posts/${postId}/comments/${commentId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ text: newText, user: currentUser.id }),
        }
      );

      if (response.ok) {
        const updatedComment = await response.json();
        setPosts(
          posts.map((post) =>
            post.post.id === postId
              ? {
                  ...post,
                  comments: post.comments.map((comment) =>
                    comment.id === commentId ? updatedComment : comment
                  ),
                }
              : post
          )
        );
        setEditingComment(null);
        showSnackbar("Comment updated successfully!");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
      showSnackbar("Failed to update comment", "error");
    }
    handleConfirmClose();
  };

  const deleteComment = async (postId, commentId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/community/api/posts/${postId}/comments/${commentId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        setPosts(
          posts.map((post) =>
            post.post.id === postId
              ? {
                  ...post,
                  comments: post.comments.filter(
                    (comment) => comment.id !== commentId
                  ),
                }
              : post
          )
        );
        showSnackbar("Comment deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      showSnackbar("Failed to delete comment", "error");
    }
    handleConfirmClose();
  };

  // UI Helper Functions
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handlePostMenuOpen = (event, post) => {
    setAnchorEl(event.currentTarget);
    setSelectedPost(post);
  };

  const handlePostMenuClose = () => {
    setAnchorEl(null);
    setSelectedPost(null);
  };

  const handleEditClick = (post) => {
    setEditingPost(post);
    setEditedContent({
      title: post.title,
      content: post.content,
    });
    setEditDialogOpen(true);
    handlePostMenuClose();
  };

  // Render Functions
  const renderComment = (postId, comment) => (
    <Box key={comment.id} sx={{ mb: 2 }}>
      {editingComment?.id === comment.id ? (
        <Box display="flex" alignItems="center">
          <TextField
            fullWidth
            value={editingComment.text}
            onChange={(e) =>
              setEditingComment({ ...editingComment, text: e.target.value })
            }
            size="small"
          />
          <Button
            onClick={() =>
              openConfirmDialog("editComment", {
                postId,
                comment: editingComment,
              })
            }
          >
            Save
          </Button>
          <Button onClick={() => setEditingComment(null)}>Cancel</Button>
        </Box>
      ) : (
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <Avatar sx={{ mr: 2 }} />
            <Box>
              <Typography variant="body2">{comment.text}</Typography>
              <Typography variant="caption" color="textSecondary">
                {new Date(comment.created_at).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
          {currentUser?.id === comment.user && (
            <Box>
              <IconButton
                size="small"
                onClick={() => setEditingComment({ ...comment })}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() =>
                  openConfirmDialog("deleteComment", {
                    postId,
                    commentId: comment.id,
                  })
                }
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );

  const renderPost = ({ post, comments }) => (
    <Card key={post.id} sx={{ mb: 4 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <Avatar sx={{ mr: 2 }} />
            <Box>
              <Typography variant="h6">{post.title}</Typography>
              <Typography variant="caption" color="textSecondary">
                Posted by #{post.author} on{" "} {post.created_at}
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    style={{ maxWidth: "100%", marginTop: 16 }}
                  />
                )}
                {post.video && (
                  <video
                    src={post.video}
                    controls
                    style={{ width: "100%", marginTop: 16 }}
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </Typography>
              <Typography variant="h6">{post.title}</Typography>
            </Box>
          </Box>

          {currentUser?.id === post.author && (
            <Box display="flex" alignItems="center">
              <IconButton onClick={() => handleEditClick(post)}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                onClick={() =>
                  openConfirmDialog("deletePost", { postId: post.id })
                }
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>

        <Typography variant="body1" sx={{ my: 2 }}>
          {post.content}
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button
            startIcon={<CommentIcon />}
            onClick={() =>
              setExpandedPostId(expandedPostId === post.id ? null : post.id)
            }
          >
            {comments.length} Comments
          </Button>
          <IconButton>{/* <ShareIcon /> */}</IconButton>
        </Box>

        {expandedPostId === post.id && (
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 2 }} />
            {comments.map((comment) => renderComment(post.id, comment))}
            <Box display="flex" alignItems="center" sx={{ mt: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Add a comment..."
                value={newComments[post.id] || ""}
                onChange={(e) =>
                  setNewComments({
                    ...newComments,
                    [post.id]: e.target.value,
                  })
                }
              />
              <Button
                variant="contained"
                sx={{ ml: 1 }}
                onClick={() =>
                  openConfirmDialog("createComment", { postId: post.id })
                }
              >
                Post
              </Button>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  // Filter posts based on search
  const filteredPosts = posts.filter((post) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      post.post.title.toLowerCase().includes(searchLower) ||
      post.post.content.toLowerCase().includes(searchLower)
    );
  });

  // Handle confirmation actions
  const handleConfirm = async () => {
    try {
      switch (confirmType) {
        case "createPost":
          await handleConfirmCreatePost();
          break;
        case "editPost":
          await updatePost();
          break;
        case "deletePost":
          await deletePost(confirmationData.postId);
          break;
        case "createComment":
          await createComment(confirmationData.postId);
          break;
        case "editComment":
          await updateComment(
            confirmationData.postId,
            confirmationData.comment.id,
            confirmationData.comment.text
          );
          break;
        case "deleteComment":
          await deleteComment(
            confirmationData.postId,
            confirmationData.commentId
          );
          break;
        default:
          console.error("Unknown confirmation type:", confirmType);
      }
    } catch (error) {
      console.error("Error during confirmation:", error);
      showSnackbar("Operation failed", "error");
    }
  };

  return (
    <>
      {/* {accessToken ? <Header /> : <HeaderPublic />} */}
      <Container maxWidth="lg">
        <Box p={4}>
          <Typography variant="h4" gutterBottom>
            Jobs Portals, Events & Competitions
          </Typography>

          {/* Search Bar */}


          {/* New Post Form */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Post a New Job
              </Typography>
              <TextField
                fullWidth
                label="Title"
                value={newPost.title}
                onChange={(e) =>
                  setNewPost({ ...newPost, title: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Content"
                multiline
                rows={4}
                value={newPost.content}
                onChange={(e) =>
                  setNewPost({ ...newPost, content: e.target.value })
                }
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="post-type-label">POST TYPE</InputLabel>
                <Select
                  labelId="post-type-label"
                  id="post-type"
                  value={newPost.typePost}
                  label="POST TYPE"
                  onChange={(e) =>
                    setNewPost({ ...newPost, typePost: e.target.value })
                  }
                >
                  <MenuItem value="events">Events</MenuItem>
                  <MenuItem value="jobs">Jobs</MenuItem>
                  <MenuItem value="competitions">Competitions</MenuItem>
                </Select>
              </FormControl>

              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Upload Image or Video
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  alignItems: "flex-start",
                  mb: 3,
                }}
              >
                {/* Image Upload */}
                <label htmlFor="upload-image">
                  <input
                    type="file"
                    accept="image/*"
                    id="upload-image"
                    hidden
                    onChange={(e) =>
                      setNewPost({ ...newPost, image: e.target.files[0] })
                    }
                  />

                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      border: "2px dashed #ccc",
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      cursor: "pointer",
                      "&:hover": { borderColor: "#1976d2", color: "#1976d2" },
                    }}
                  >
                    <ImageIcon fontSize="large" />
                    <Typography variant="body2">Image</Typography>
                  </Box>
                </label>

                {/* Image Preview */}
                {newPost.image && (
                  <div
                    style={{ position: "relative", width: 100, height: 100 }}
                  >
                    <img
                      src={URL.createObjectURL(newPost.image)}
                      alt="Preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 8,
                        objectFit: "cover",
                      }}
                    />
                    <div
                      onClick={() => setNewPost({ ...newPost, image: null })}
                      style={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        backgroundColor: "white",
                        borderRadius: "50%",
                        width: 20,
                        height: 20,
                        color: "black",
                        fontWeight: "bold",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        boxShadow: "0 0 4px rgba(0,0,0,0.3)",
                        userSelect: "none",
                      }}
                      title="Remove image"
                    >
                      ×
                    </div>
                  </div>
                )}

                {/* Video Upload */}
                <label htmlFor="upload-video">
                  <input
                    type="file"
                    accept="video/*"
                    id="upload-video"
                    hidden
                    onChange={(e) =>
                      setNewPost({ ...newPost, video: e.target.files[0] })
                    }
                  />

                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      border: "2px dashed #ccc",
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      cursor: "pointer",
                      "&:hover": { borderColor: "#1976d2", color: "#1976d2" },
                    }}
                  >
                    <VideoLibraryIcon fontSize="large" />
                    <Typography variant="body2">Video</Typography>
                  </Box>
                </label>

                {/* Video Preview */}
                {newPost.video && (
                  <div
                    style={{ position: "relative", width: 100, height: 100 }}
                  >
                    <video
                      width="100"
                      height="100"
                      controls
                      style={{ borderRadius: 8, objectFit: "cover" }}
                    >
                      <source src={URL.createObjectURL(newPost.video)} />
                      Your browser does not support the video tag.
                    </video>
                    <div
                      onClick={() => setNewPost({ ...newPost, video: null })}
                      style={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        backgroundColor: "white",
                        borderRadius: "50%",
                        width: 20,
                        height: 20,
                        color: "black",
                        fontWeight: "bold",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        boxShadow: "0 0 4px rgba(0,0,0,0.3)",
                        userSelect: "none",
                      }}
                      title="Remove video"
                    >
                      ×
                    </div>
                  </div>
                )}
              </Box>

              <Button
                variant="contained"
                color="primary"
                onClick={createPost}
                disabled={!newPost.title || !newPost.content}
              >
                Create Post
              </Button>
            </CardContent>
          </Card>

          {/* Posts List */}
          {/* {filteredPosts
            .sort(
              (a, b) =>
                new Date(b.post.created_at) - new Date(a.post.created_at)
            )
            .map(renderPost)} */}
        </Box>

        <Box>

          {filteredPosts
  .filter(item => {
    const userId = localStorage.getItem("userId");
    return String(item.post.author) === String(userId); // ensures string comparison
  })
  .sort((a, b) => new Date(b.post.created_at) - new Date(a.post.created_at))
  .map(renderPost)}
        </Box>
      </Container>

      {/* Post Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handlePostMenuClose}
      >
        <MenuItem onClick={() => handleEditClick(selectedPost)}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit Post
        </MenuItem>
        <MenuItem
          onClick={() => {
            openConfirmDialog("deletePost", { postId: selectedPost?.id });
            handlePostMenuClose();
          }}
          sx={{ color: "error.main" }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete Post
        </MenuItem>
      </Menu>

      {/* Edit Post Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={editedContent.title}
            onChange={(e) =>
              setEditedContent({ ...editedContent, title: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Content"
            multiline
            rows={4}
            value={editedContent.content}
            onChange={(e) =>
              setEditedContent({ ...editedContent, content: e.target.value })
            }
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => openConfirmDialog("editPost")}
            color="primary"
            disabled={!editedContent.title || !editedContent.content}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Universal Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={handleConfirmClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {confirmType === "deletePost" || confirmType === "deleteComment"
            ? "Confirm Deletion"
            : "Confirm Action"}
        </DialogTitle>
        <DialogContent>
          <Typography>{getConfirmationContent()}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            color={confirmType?.includes("delete") ? "error" : "primary"}
            variant="contained"
          >
            {confirmType?.includes("delete") ? "Delete" : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* <AppFooter /> */}
    </>
  );
}

export default JobPosts;
