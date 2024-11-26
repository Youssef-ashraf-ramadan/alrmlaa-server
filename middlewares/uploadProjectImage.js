const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads/projects"));
  },
  filename: (req, file, cb) => {
    crypto.randomBytes(16, (err, hash) => {
      if (err) cb(err);
      file.filename = `${hash.toString("hex")}-${file.originalname}`;
      cb(null, file.filename);
    });
  },
});

const uploadProjectImage = multer({
  storage: storage,
  limits: {
    fileSize: 100000000,
  },
  fileFilter(req, file, cb) {
    if (
      !file.originalname.match(
        /\.(jpg|jpeg|png|gif|bmp|tiff|webp|svg|heic|heif|ico|avif)$/
      )
    ) {
      return cb(
        new Error(
          "Please upload a valid image file (supported formats: JPG, PNG, etc.)."
        )
      );
    }

    cb(null, true);
  },
});

module.exports = uploadProjectImage;
