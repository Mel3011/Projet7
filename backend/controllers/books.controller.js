const { Book } = require("../models/books.model");

// Récupérer tous les livres
exports.findAll = async (req, res) => {
  try {
    const books = await Book.findAll(); // modèle pour récupérer tous les livres
    return res.status(200).json(books);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// Récupérer un livre par son ID
exports.findOneById = async (req, res) => {
  try {
    if (req.params.id === "bestrating") {
      // logique pour récupérer les livres les mieux notés
      const topRatedBooks = await Book.findTopRated();
      return res.status(200).json(topRatedBooks);
    }
    const book = await Book.findById(req.params.id); // modèle pour rechercher le livre par son ID
    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }
    return res.status(200).json(book);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// Ajouter un livre
exports.addBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;

  // Vérifiez si une image a été téléchargée
  if (!req.file) {
    return res
      .status(400)
      .json({ error: "Veuillez ajouter une image pour le livre." });
  } else {
    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.path}`,
    });

    book
      .save()
      .then(() => {
        res.status(201).json({ message: "Livre enregistré !" });
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
  }
};

// Modifier un livre
exports.updateBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.path
        }`,
      }
    : { ...req.body };

  delete bookObject._userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Livre modifié!" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//Supprimer un livre
const fs = require("fs");

exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });
    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }
    if (book.userId != req.auth.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const filename = book.imageUrl.split("/images/")[1];

    fs.unlink(`images/${filename}`, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Erreur lors de la suppression de l'image" });
      }

      // Suppression image ok, suppression du livre
      Book.deleteOne({ _id: req.params.id })
        .then(() => {
          res.status(200).json({ message: "Objet supprimé !" });
        })
        .catch((error) => {
          res
            .status(500)
            .json({ error: "Erreur lors de la suppression du livre" });
        });
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

// Afficher les mieux notés
exports.findTopRated = async (req, res) => {
  try {
    const topRatedBooks = await Book.findTopRated(); // modèle pour récupérer tous les livres
    return res.status(200).json(topRatedBooks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// Noter un livre
exports.rateBook = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const bookId = req.params.id;
    const { rating } = req.body;
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    const existRating = await Book.findOne({
      id: bookId,
      "ratings.userId": userId,
    });
    if (existRating) {
      return res.status(401).json({ message: "Vous avez déjà noté ce livre" });
    } else {
      // Ajouter la nouvelle note à la liste des notes du livre
      book.ratings.push({ userId, grade: rating });

      // Calcul de la note moyenne à partir des notes existantes
      const totalRatings = book.ratings.reduce(
        (sum, ratingObj) => sum + ratingObj.grade,
        0
      );
      const averageRating = totalRatings / book.ratings.length;
      book.averageRating = Math.round(averageRating * 10) / 10;

      await book.save();
    }
    return res.status(200).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur interne" });
  }
};
