import express from "express";
import {
  clerkWebhook,
  forgotPassword,
  login,
  logout,
  register,
  resetPassword,
  verifyEmail,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post('/webhook/clerk', clerkWebhook);

export default router;
