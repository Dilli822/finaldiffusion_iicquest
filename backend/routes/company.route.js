import express from "express";

import {
  getCompany,
  getCompanyById,
  registerCompany,
  updateCompany,
} from "../controllers/company.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.post("/register", verifyToken, registerCompany);
router.get("/get", verifyToken, getCompany);

router.post("/get/:ComponayId", verifyToken, getCompanyById);

router.post("/update/:id", verifyToken, upload.single("image"), updateCompany);

export default router;
