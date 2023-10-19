const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

// S'inscrire
exports.signup = async (req, res, next) => {
  const { email, password } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ message: "Veuillez entrer une adresse e-mail valide." });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: "Le mot de passe doit comporter au moins 8 caractères.",
    });
  }

  const passwordRegex = /^(?=.*\d)(?=.*[A-Z])/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Le mot de passe doit contenir au moins un chiffre et une majuscule.",
    });
  }

  UserModel.findOne({ email })
    .then((user) => {
      if (user !== null) {
        res.status(401).json({
          message: "Utilisateur déja enregistré ! Veuillez vous connecter !",
        });
      } else {
        // hachage du mot de passe 10 fois
        bcrypt.hash(req.body.password, 10).then((hash) => {
          // Création de la nouvelle instance de User
          const user = new UserModel({
            email: email,
            password: hash,
          });
          // Sauvegarder du nouvelle user dans la BDD
          user
            .save()
            .then(() => res.status(201).json({ message: "utilisateur créé !" }))
            .catch((error) => res.status(400).json({ error }));
        });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

// Se connecter
exports.login = (req, res, next) => {
  // Je recherche un user qui correspond à l'email transmis par le client
  userModel
    .findOne({ email: req.body.email })
    .then((user) => {
      if (user === null) {
        res
          .status(401)
          .json({ message: "identifiant et/ou mot de passe incorrect" });
      } else {
        // je compare le mdp transmis par le client à celui enregistré dans la BDD
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              res
                .status(401)
                .json({ message: "identifiant et/ou mot de passe incorrect" });
            } else {
              res.status(200).json({
                userId: user._id,
                token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
                  expiresIn: "24h",
                }),
              });
            }
          })
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
