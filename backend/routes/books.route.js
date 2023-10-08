const express = require("express");
const router = express.Router();
const booksCtrl = require("../controllers/books.controller");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const sharp = require("../middleware/sharp-config");

router.get("/", booksCtrl.findAll);
router.get("/:id", booksCtrl.findOneById);
router.get("/bestrating", booksCtrl.findTopRated);
router.post("/", auth, multer, sharp, booksCtrl.addBook);
router.put("/:id", auth, multer, sharp, booksCtrl.updateBook);
router.delete("/:id", auth, multer, booksCtrl.deleteBook);
router.post("/:id/rating", auth, booksCtrl.rateBook);

module.exports = router;
