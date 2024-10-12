const jwt = require("jsonwebtoken");
const Register = require("../models/registerSchema");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const {
  authenticateToken,

} = require("../middlewares/authenticateToken");
const mongoose = require("mongoose");
const authorizeAdmin = require("../middlewares/authorizeAdmin");

const registerController = {
  // Login function
  login: [
    async (req, res) => {
      try {
        const { username, password } = req.body;

        // Check if the user exists in the database
        const userExists = await Register.findOne({ username });
        if (!userExists) {
          return res
            .status(404)
            .json({ message: "User not found. Please sign up." });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, userExists.password);
        if (!isMatch) {
          return res
            .status(401)
            .json({ message: "Invalid password. Please try again." });
        }

        // Generate a JWT token with user details
        const token = jwt.sign(
          {
            id: userExists._id,
            username: userExists.username,
            isAdmin: userExists.isAdmin,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" } // Set token expiration time
        );

        return res.status(200).json({
          message: "Login successful",
          token,
          user: {
            username: userExists.username,
            contact: userExists.contact,
            isAdmin: userExists.isAdmin, // Include isAdmin status in the response
          },
        });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
      }
    },
  ],
  //    Syntax Example For Developers
  // exports .getData = [ authenticateToken ,
  //     async (req, res) =>{

  //     }
  // ]
  // Signup function with validation
  signup: [
    // Validation rules
    body("contact").isString().notEmpty().withMessage("Contact is required."),
    body("username").isString().notEmpty().withMessage("Username is required."),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long."),
    body("isAdmin")
      .optional()
      .isBoolean()
      .withMessage("isAdmin must be a boolean value."),

    // Signup controller function
    async (req, res) => {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      try {
        const { contact, username, password, isAdmin } = req.body;

        // Check if a user with the same username or contact already exists
        const userExists = await Register.findOne({
          $or: [{ username }, { contact }],
        });

        if (userExists) {
          return res
            .status(400)
            .json({ message: "Username or contact already in use." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const registerUser = new Register({
          contact,
          username,
          password: hashedPassword,
          isAdmin: isAdmin !== undefined ? isAdmin : false, // Default to false if not provided
        });

        await registerUser.save();
        return res
          .status(201)
          .json({ message: "User registered successfully" });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
      }
    },
  ],
  // Get all users (admin only)
  getUsers: [
    authenticateToken,
    authorizeAdmin,
    async (req, res) => {
      try {
        const allUsers = await Register.find();
        return res.status(200).json({
          message: "Users Data Found",
          count: allUsers.length,
          data: allUsers,
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
      }
    },
  ],

  // Get single user by ID (admin only)
  singleUser: [
    authenticateToken,
    authorizeAdmin,
    async (req, res) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
          return res.status(400).json({ message: "Invalid user ID" });
        }
        const singleUser = await Register.findById(req.params.id);
        if (!singleUser) {
          return res.status(404).json({ message: "User not found" });
        }
        return res.json({
          message: "User Data Found",
          data: singleUser,
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
      }
    },
  ],

  // Update user by ID (admin only)
  updateUserID: [
    authenticateToken,
    authorizeAdmin,
    async (req, res) => {
      try {
        const { username, password } = req.body;
        const hashedPassword = password
          ? await bcrypt.hash(password, 10)
          : undefined;

        const updatedUser = await Register.findByIdAndUpdate(
          req.params.id,
          { username, ...(hashedPassword && { password: hashedPassword }) }, // Only update password if provided
          { new: true } // Return the updated document
        );

        if (!updatedUser) {
          return res.status(404).json({ message: "User not found" });
        }

        return res.json({
          message: "User Credentials Updated",
          data: updatedUser,
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
      }
    },
  ],

  // Delete user by ID (admin only)
  deleteUser: [
    authenticateToken,
    authorizeAdmin,
    async (req, res) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
          return res.status(400).json({ message: "Invalid user ID" });
        }
        const deletedUser = await Register.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
          return res.status(404).json({ message: "User not found" });
        }
        return res.json({
          message: "User deleted successfully",
          data: deletedUser,
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
      }
    },
  ],

  // Logout function (token invalidation placeholder)
  logout: [
    authenticateToken,
    (req, res) => {
      try {
        // Placeholder for token invalidation logic (if using blacklisting or stateful JWT)
        return res
          .status(200)
          .json({ message: "Logout successful. Token invalidated." });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Logout failed." });
      }
    },
  ],

  // Admin dashboard
  admin: [
    (req, res) => {
      res.json({ message: "Welcome to Admin Dashboard!" });
    },
  ],

  // User dashboard
  user: [
    (req, res) => {
      res.json({ message: "Welcome to User!" });
    },
  ],
};
module.exports = registerController;
