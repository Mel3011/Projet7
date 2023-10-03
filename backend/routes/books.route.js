const express = require("express");
const router = express.Router();
const booksCtrl = require("../controllers/books.controller");
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')

router.get("/", auth, booksCtrl.findAll);
router.get("/:id", auth, booksCtrl.findOneById);
// router.get("/bestrating", auth, booksCtrl.findTopRated);
router.post("/", auth, multer, booksCtrl.addBook);
// router.put("/:id", auth, multer, booksCtrl.updateBook);
// router.delete("/:id", auth, booksCtrl.deleteBook);
// router.post("/:id/rating", auth, multer, booksCtrl.rateBook);

module.exports = router;
