const { Book } = require("../models/books.model");

// récupérer tous les livres
exports.findAll = async (req, res) => {
  try {
    const books = await Book.findAll(); // modèle pour récupérer tous les livres
    return res.status(200).json(books);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// récupérer un livre par son ID
exports.findOneById = async (req, res) => {
  try {
    const book = await Book.findOneById(req.params.id); // modèle pour rechercher le livre par son ID
    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }
    return res.status(200).json(book);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// ajouter un livre
exports.addBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  book.save()
  .then(() => { res.status(201).json({message: 'Livre enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};