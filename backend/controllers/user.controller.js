const UserModel = require('../models/user.model')
const bcrypt = require('bcrypt')

exports.signup = async (req, res, next) => {
    const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({  email, password: hashedPassword });
    await user.save();
    console.log("New user created:", user);
    return res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
  };


  exports.login = async (req, res, next) => {
    const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({  email, password: hashedPassword });
    await user.save();
    console.log("New user created:", user);
    return res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
  };
