import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { ImageIcon, VideoIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import PostFeed from "./PostFeed";

function FeedPage({ clicked }) {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    file: null,
  });
  const [editPost, setEditPost] = useState(null); // State to track post being edited
  const fileInputRef = useRef(null);

  // Fetch posts on mount
  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/postFeed/posts", {
          withCredentials: true,
        });
        console.log("fetch posts response-->", response);
        setPosts(response.data.posts);
      } catch (error) {
        console.log("fetch posts error-->", error);
      }
    };
    fetchMyPosts();
  }, []);

  console.log("posts fetched-->", posts);

  const videoPosts = posts.filter((post) => post.file?.type === "video");
  const normalPosts = posts.filter((post) => !post.file || post.file.type === "image");

  // Handle input changes for create/edit form
  const handleInputChange = (e, field) => {
    if (editPost) {
      setEditPost({ ...editPost, [field]: e.target.value });
    } else {
      setNewPost({ ...newPost, [field]: e.target.value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (editPost) {
        setEditPost({ ...editPost, file });
      } else {
        setNewPost({ ...newPost, file });
      }
    }
  };

  // Handle form submission for create or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEditing = !!editPost;
    const postData = isEditing ? editPost : newPost;

    if (!postData.title || (!postData.content && !postData.file)) {
      alert("Title and either content or a file are required!");
      return;
    }

    const formData = new FormData();
    formData.append("title", postData.title.trim());
    formData.append("content", postData.content.trim());
    if (postData.file) {
      formData.append("file", postData.file);
    }

    try {
      let response;
      if (isEditing) {
        // Update post
        response = await axios.put(
          `http://localhost:8000/api/postFeed/update/${postData.id}`,
          formData,
          { withCredentials: true }
        );
      } else {
        // Create post
        response = await axios.post(
          "http://localhost:8000/api/postFeed/create-post",
          formData,
          { withCredentials: true }
        );
      }

      if (response.data.success) {
        console.log(isEditing ? "Post updated successfully" : "Post created successfully");
        const { post } = response.data;
        const formattedPost = {
          id: post._id,
          authorName: post.author?.username || "You", // Adjust based on your backend response
          authorImage: post.author?.image || "/default-user.png",
          title: post.title,
          content: post.content,
          createdAt: new Date(post.createdAt),
          file: post.file
            ? {
                url: post.file.url,
                type: post.file.type,
              }
            : undefined,
          tags: post.tags || [],
        };

        if (isEditing) {
          // Update the post in the state
          setPosts(posts.map((p) => (p.id === post._id ? formattedPost : p)));
          setEditPost(null); // Clear edit mode
        } else {
          // Add new post to the state
          setPosts([formattedPost, ...posts]);
          setNewPost({ title: "", content: "", file: null });
        }

        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Reset file input
        }
      }
    } catch (error) {
      console.error(`Error ${isEditing ? "updating" : "creating"} post:`, error);
      alert(error.response?.data?.message || `Failed to ${isEditing ? "update" : "create"} post`);
    }
  };

  // Start editing a post
  const handleEdit = (post) => {
    setEditPost({
      id: post.id,
      title: post.title || "",
      content: post.content || "",
      file: null, // Reset file for edit (user can re-upload if needed)
      tags: post.tags || [],
    });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditPost(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
  };

  const handleIconClick = (type) => {
    if (!fileInputRef.current) return;
    fileInputRef.current.setAttribute("accept", type === "video" ? "video/*" : "image/*");
    fileInputRef.current.click();
  };

  return (
    <div className="max-w-3xl mx-auto my-5">
      <div className="w-full shadow-lg p-4 mb-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">
          {editPost ? "Edit Post" : clicked === "video" ? "Upload Video" : "Upload Post"}
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            placeholder="Post title"
            value={editPost ? editPost.title : newPost.title}
            onChange={(e) => handleInputChange(e, "title")}
            required
          />
          <Textarea
            rows={5}
            placeholder="Write your post content here..."
            value={editPost ? editPost.content : newPost.content}
            onChange={(e) => handleInputChange(e, "content")}
            required={!editPost?.file && !newPost.file} // Content required only if no file
          />
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept={clicked === "video" ? "video/*" : "image/*"}
          />
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleIconClick(clicked === "video" ? "video" : "image")}
              title={clicked === "video" ? "Upload Video" : "Upload Image"}
            >
              {clicked === "video" ? <VideoIcon size={24} /> : <ImageIcon size={24} />}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button type="submit">{editPost ? "Update Post" : "Post"}</Button>
            {editPost && (
              <Button type="button" variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>

      <div className="py-4 flex flex-col items-center px-2">
        {(clicked === "video" ? videoPosts : normalPosts).map((post) => (
          <PostFeed key={post._id} post={post} onEdit={handleEdit} />
        ))}
      </div>
    </div>
  );
}

export default FeedPage;