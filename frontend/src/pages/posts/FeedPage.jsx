import React, { useState, useRef } from "react";
import axios from "axios";
import PostFeed from "./PostFeed";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageIcon, VideoIcon } from "lucide-react";
import { toast } from "sonner";

function FeedPage() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [posts, setPosts] = useState([
    {
      id: 1,
      authorName: "John Doe",
      authorImage: "",
      content: "Just posted something amazing! 🎉",
      createdAt: new Date(),
      tags: ["announcement", "fun", "update"],
    },
    {
      id: 2,
      authorName: "Jane Smith",
      authorImage: "",
      content: "A beautiful sunset I captured!",
      createdAt: new Date(),
      file: {
        url: "https://img.freepik.com/free-photo/sunset-time-tropical-beach-sea-with-coconut-palm-tree_74190-1075.jpg",
      },
      tags: ["sunset", "nature", "photography"],
    },
    {
      id: 3,
      authorName: "Alex Johnson",
      authorImage: "",
      content: "Watch this quick demo 🚀",
      createdAt: new Date(),
      file: {
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
      tags: ["demo", "video", "tech"],
    },
  ]);

  const [newPost, setNewPost] = useState({
    content: "",
    file: null,
  });

  const fileInputRef = useRef(null);

  const handleContentChange = (e) => {
    setNewPost({ ...newPost, content: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPost({ ...newPost, file });
    }
  };

  // Helper to extract hashtags from content text
  const extractTagsFromContent = (text) => {
    const regex = /#(\w+)/g;
    const tags = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      tags.push(match[1].toLowerCase());
    }
    return tags;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.content && !newPost.file) return;

    try {
      const formData = new FormData();
      if (newPost.content) formData.append("content", newPost.content);

      // Extract tags from hashtags in content
      const extractedTags = extractTagsFromContent(newPost.content);
      if (extractedTags.length > 0) {
        formData.append("tags", extractedTags.join(","));
      }

      if (newPost.file) {
        formData.append("file", newPost.file);
      }

      const response = await axios.post(
        `${API_URL}/post/create-content`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        const newPostData = {
          ...response.data.post,
          tags: extractTagsFromContent(response.data.post.content),
        };

        setPosts((prevPosts) => [newPostData, ...prevPosts]);
        setNewPost({ content: "", file: null });
      } else {
        toast.error("Failed to create post.");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Error creating post. Please try again.");
    }
  };

  const handleIconClick = (type) => {
    if (!fileInputRef.current) return;
    if (type === "image") {
      fileInputRef.current.setAttribute("accept", "image/*");
    } else if (type === "video") {
      fileInputRef.current.setAttribute("accept", "video/*");
    }
    fileInputRef.current.click();
  };

  return (
    <div className="max-w-3xl mx-auto my-10">
      {/* Sticky Create Post Form */}
      <div className="sticky top-0 z-10 bg-white shadow-lg p-4 mb-6 rounded-lg">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Create Post</h1>
            <Button type="submit">Post</Button>
          </div>
          <div className="flex gap-4">
            {/* Textarea */}
            <Textarea
              rows={5}
              placeholder="Write your post content here..."
              value={newPost.content}
              onChange={handleContentChange}
              className="flex-1"
            />

            {/* Removed tags input since we're extracting from content */}

            <div className="flex gap-4">
              {/* File Upload Buttons */}
              <div className="flex flex-col gap-2 items-center justify-start pt-2">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => handleIconClick("image")}
                  title="Upload Image"
                >
                  <ImageIcon size={24} />
                </Button>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => handleIconClick("video")}
                  title="Upload Video"
                >
                  <VideoIcon size={24} />
                </Button>
              </div>
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </form>
      </div>

      {/* Post Feed */}
      <div className="py-4 flex flex-col items-center px-2">
        {posts.map((post) => (
          <PostFeed key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default FeedPage;
