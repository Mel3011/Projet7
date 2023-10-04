const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ratingsSchema = new Schema({
  userId: { type: String, required: true },
  grade: { type: Number, required: true },
});

const bookSchema = new Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [ratingsSchema],
  averageRating: { type: Number, required: true },
});

// méthode statique "findAll"
bookSchema.statics.findAll = function () {
  return this.find({});
};

// méthode statique "findToprated"
bookSchema.statics.findTopRated = function () {
  return this.find({}).sort({ averageRating: -1 }).limit(10);
};

const Book = mongoose.model("Book", bookSchema);

module.exports = { Book };
