import express from "express";
import {
  createPost,
  getAllPosts,
  getMyPosts,
  getSinglePost,
  handleChat,
  replyPost,
} from "../controllers/postFeed.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.post("/create-post", verifyToken, upload.single("file"), createPost);
router.get("/posts", verifyToken, getAllPosts);
router.get("/my-posts", verifyToken, getMyPosts);
router.get("/:postId", verifyToken, getSinglePost);

router.post("/:postId/reply", verifyToken, replyPost);

// Chatbot
router.post("/chat", handleChat);

export default router;
