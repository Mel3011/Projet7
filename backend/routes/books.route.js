const express = require("express");
const router = express.Router();
const booksCtrl = require("../controllers/books.controller");

router.get("/", booksCtrl.findAll);
router.get("/:id", booksCtrl.findOneById);
router.get("/bestrating", booksCtrl.findTopRated);
router.post("/", booksCtrl.addBook);
router.put("/:id", booksCtrl.updateBook);
router.delete("/:id", booksCtrl.deleteBook);
router.post("/:id/rating", booksCtrl.rateBook);

module.exports = router;
