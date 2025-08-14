import express from "express";
import {
  registerUser,
  loginUser,
  fetchUserData,
  applyJob,
  getUserAppliedJobs,
  uploadResume,
  getAllUsers,
  updateUserProfile,
} from "../controllers/userController.js";
import upload from "../utils/upload.js";
import userAuthMiddleware from "../middlewares/userAuthMiddleware.js";
import companyAuthMiddleware from "../middlewares/companyAuthMiddleware.js";

const router = express.Router();

router.post("/register-user", upload.single("image"), registerUser);
router.post("/login-user", upload.single("image"), loginUser);
router.get("/user-data", userAuthMiddleware, fetchUserData);
router.post("/apply-job", userAuthMiddleware, applyJob);
router.post("/get-user-applications", userAuthMiddleware, getUserAppliedJobs);
router.post(
  "/upload-resume",
  userAuthMiddleware,
  upload.single("resume"),
  uploadResume
);
router.get("/all-users", companyAuthMiddleware, getAllUsers);

// Update profile: supports JSON body and optional image file under key 'image'
router.put(
  "/update-profile",
  userAuthMiddleware,
  upload.single("image"),
  updateUserProfile
);

export default router;
