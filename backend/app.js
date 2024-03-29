const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user.route");
const booksRoutes = require("./routes/books.route");
const path = require("path");
require("dotenv").config();

mongoose
  .connect(process.env.CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((error) => console.log("Connexion à MongoDB échouée !", error));

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/api/auth", userRoutes);
app.use("/api/books", booksRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
