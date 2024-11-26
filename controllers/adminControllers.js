const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const dotenv = require("dotenv");
dotenv.config();

/** =============================
  * @desc  Login admin
  * @route  /api/admin/login
  * @method  POST
=============================*/
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.status(404).json({ message: "Account not found..!" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password is incorrect..!" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(200).json({
      token,
      admin,
    });
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).json({ message: "Error during admin login" });
  }
};

/** =============================
  * @desc  Get admin profile
  * @route  /api/admin/profile
  * @method  POST
=============================*/
const getAdminProfile = async (req, res) => {
  try {
    const id = req.adminId;

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Account not found..!" });
    }

    res.status(200).json(admin);
  } catch (error) {
    console.error("Error during get admin profile:", error);
    res.status(500).json({ message: "Error during get admin profile" });
  }
};

/** =============================
  * @desc  Update admin profile image
  * @route  /api/admin/profile/update-image
  * @method  PUT
=============================*/
const updateProfileImage = async (req, res) => {
  try {
    const image = req.file;
    const imagePath = `${process.env.SERVER_URL}/uploads/avatars/${image.filename}`;

    const admin = await Admin.findOne();

    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    if (admin.image) {
      const oldImagePath = path.join(
        __dirname,
        "../uploads/avatars",
        path.basename(admin.image)
      );

      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error("Error deleting old image:", err);
        }
      });
    }

    admin.image = imagePath;
    await admin.save();

    res
      .status(200)
      .json({
        message: "Image has been updated successfully.",
        imagePath: admin.image,
      });
  } catch (error) {
    console.error("Error during update admin profile image:", error);
    res
      .status(500)
      .json({ message: "Error during update admin profile image." });
  }
};

module.exports = {
  loginAdmin,
  getAdminProfile,
  updateProfileImage,
};
