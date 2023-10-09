const sharp = require("sharp");
const fs = require("fs");

module.exports = (req, res, next) => {
  if (req.file && req.file.path) {
    const filePath = req.file.path;
    const oriName = req.file.originalname;
    const nameOpti = oriName.slice(0, -4) + "_" + Date.now() + ".webp";
    const fileOpti = "images/" + nameOpti;

    sharp(filePath)
      .webp()
      .toFile(fileOpti)
      .then(() => {
        fs.unlink(filePath, () => {
          req.file.filename = nameOpti;
          req.file.path = fileOpti;
          next();
        });
      })
      .catch((error) => console.log(error));
  } else {
    // Si req.file n'est pas défini
    console.log("Aucun fichier à traiter.");
    next();
  }
};
