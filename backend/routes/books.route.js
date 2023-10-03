const express = require("express");
const router = express.Router();
const booksCtrl = require("../controllers/books.controller");
const auth = require('../middleware/auth');

router.get("/", auth, booksCtrl.findAll);
router.get("/:id", auth, booksCtrl.findOneById);
router.get("/bestrating", auth, booksCtrl.findTopRated);
router.post("/", auth, booksCtrl.addBook);
router.put("/:id", auth, booksCtrl.updateBook);
router.delete("/:id", auth, booksCtrl.deleteBook);
router.post("/:id/rating", auth, booksCtrl.rateBook);

module.exports = router;
