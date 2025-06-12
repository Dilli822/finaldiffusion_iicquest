import User from "../models/user.model.js";
// import Post from "../models/post.model.js";
import Reply from "../models/reply.model.js";
import aiService from "../services/ai.service.js";
import { v2 as cloudinary } from 'cloudinary';
import postFeedModel from "../models/postFeed.model.js";

// ---------------------------------------------------Create Post----------------------------------------------------


export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    // Check if user is authenticated
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }
    console.log("files--->",req.file)

    const author = req.userId;
    
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }
    if(!req.file)throw new Error("files is required")
    
    let fileData = null;

    
    if (req.file) {
      try {
        // Upload file directly from memory/buffer without saving locally
        const uploadedFile = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "posts",
              resource_type: req.file.mimetype.startsWith("video") ? "video" : "image",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          
          // Pipe the file buffer directly to Cloudinary
          uploadStream.end(req.file.buffer);
        });
        
        fileData = {
          url: uploadedFile.secure_url,
          public_id: uploadedFile.public_id,
          type: req.file.mimetype.startsWith("video") ? "video" : "image",
        };
      } catch (uploadError) {
        console.error("File upload error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload file",
        });
      }
    }

    if(!fileData) throw new Error("Unable to upload")

    const newPost = await postFeedModel.create({
      title,
      content,
      author,
      file: fileData,
    });
    
    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.log("Error creating post:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create post",
      error: error.message,
    });
  }
};

// ---------------------------------------------------Get All posts----------------------------------------------------

export const getAllPosts = async (req, res) => {
  try {
    const posts = await postFeedModel.find()
      .populate("author", "name imageUrl")
      .populate({
        path: "replies",
        populate: { path: "user", select: "name imageUrl" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error("Get all posts error:", error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

export const getSinglePost = async (req, res) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId)
      .populate("author", "name")
      .populate({
        path: "replies",
        populate: { path: "user", select: "name imageUrl" },
      });

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json({ post });
  } catch (error) {
    console.error("Get post error:", error);
    res.status(500).json({ message: "Failed to fetch post" });
  }
};
// ---------------------------------------------------get My Posts----------------------------------------------------

export const getMyPosts = async (req, res) => {
  const userId = req.userId;
  try {
    const posts = await Post.find({ author: userId })
      .populate("author", "name imageUrl")
      .populate({
        path: "replies",
        populate: { path: "user", select: "name imageUrl" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error("Get my posts error:", error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

// ---------------------------------------------------Reply----------------------------------------------------

export const replyPost = async (req, res) => {
  const userId = req.userId;
  const { msg } = req.body;
  const postId = req.params.postId;

  try {
    if (!msg) {
      return res.status(400).json({
        success: false,
        message: "Cannot post empty message!",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    const newReply = new Reply({
      msg: msg.trim(),
      post: postId,
      user: user._id,
    });

    await newReply.save();

    // Update Post
    post.replies.push(newReply._id);
    await post.save();

    res.status(201).json({
      success: true,
      message: "Reply posted successfully",
      reply: newReply,
    });
  } catch (error) {
    console.error("Reply post error:", error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

// ---------------------------------------------------Gemini Chat controller----------------------------------------------------

export const handleChat = async (req, res) => {
  const { input } = req.body;
  if (!input?.trim()) {
    return res.status(400).json({ message: "Cannot send empty input" });
  }

  try {
    const reply = await aiService(input);
    res.json({ reply }); // Match frontend expectation: res?.data?.reply
  } catch (error) {
    console.error("AI Service Error:", error);
    res
      .status(500)
      .json({ reply: "An error occurred while processing your request." });
  }
};

// Helper function to detect file type
const getFileType = (mimetype) => {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.startsWith("video/")) return "video";
  return "unknown";
};

export const createContent = async (req, res) => {
  const userId = req.userId; // set by auth middleware
  const { content, tags } = req.body;

  try {
    if (!content && !req.file) {
      return res.status(400).json({
        success: false,
        message: "Post must contain text or a file.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let fileData = null;
    if (req.file) {
      const upload = await uploadMedia(req.file.path);

      fileData = {
        url: upload.secure_url,
        name: req.file.originalname,
        type: getFileType(req.file.mimetype),
      };
    }

    const newPost = new Post({
      content: content?.trim(),
      author: user._id,
      file: fileData,
      tags: tags ? tags.split(",").map((tag) => tag.trim().toLowerCase()) : [],
    });

    await newPost.save();

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};