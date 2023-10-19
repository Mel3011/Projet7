const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const extension = MIME_TYPES[file.mimetype];
    const uniqueFilename = Date.now() + "." + extension;
    callback(null, uniqueFilename);
  },
});

module.exports = multer({ storage }).single("image");

const convertToWebp = (req, res, next) => {
  if (req.file && req.file.path) {
    const originalImagePath = req.file.path;
    const outputPath = path.join(
      "images",
      path.basename(originalImagePath, path.extname(originalImagePath)) +
        ".webp"
    );

    sharp.cache(false); // suppression du cache pour eviter davoir une image en double
    sharp(originalImagePath)
      .toFormat("webp")
      .resize({
        width: 800,
        height: 1200,
        fit: "contain",
      })
      .toFile(outputPath)
      .then(() => {
        if (fs.existsSync(originalImagePath)) {
          fs.unlinkSync(originalImagePath);
        }
        req.file.path = outputPath.replace("images\\", "");
        next();
      })
      .catch((error) => {
        console.error("Error converting image to webp:", error);
        next();
      });
  } else {
    next();
  }
};

module.exports.convertToWebp = convertToWebp;
