const express = require("express");
const router = express.Router();
const {
  loginAdmin,
  getAdminProfile,
  updateProfileImage,
} = require("../controllers/adminControllers");
const authMiddleware = require("../middlewares/authMiddleware");
const uploadProfileImage = require("../middlewares/uploadProfileImage");

router.post("/login", loginAdmin);
router.get("/profile", authMiddleware, getAdminProfile);
router.post(
  "/profile/update-image",
  uploadProfileImage.single("image"),
  updateProfileImage
);

module.exports = router;
