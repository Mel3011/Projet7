const express = require("express");
const router = express.Router();
const booksCtrl = require("../controllers/books.controller");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.get("/", booksCtrl.findAll);
router.get("/:id", booksCtrl.findOneById);
router.get("/bestrating", booksCtrl.findTopRated);
router.post("/", auth, multer, booksCtrl.addBook);
router.put("/:id", auth, multer, booksCtrl.updateBook);
router.delete("/:id", auth, multer, booksCtrl.deleteBook);
router.post("/:id/rating", auth, booksCtrl.rateBook);

module.exports = router;
