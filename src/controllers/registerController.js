const express = require("express");
const jwt = require("jsonwebtoken");
const Register = require("../models/registerSchema");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// Login function
exports.login = [
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

      // Store user ID in the session
      req.session.userId = userExists._id;

      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          username: userExists.username,
          contact: userExists.contact,
          isAdmin: userExists.isAdmin,
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  },
];

// Signup function with validation
exports.signup = [
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
      return res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  },
];

// Get all users (admin only)
exports.getUsers = [
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
];

// Get single user by ID (admin only)
exports.singleUser = [
  async (req, res) => {
    try {
      const userId = req.params.id;

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const singleUser = await Register.findById(userId);
      if (!singleUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        message: "User Data Found",
        data: singleUser,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  },
];

// Update user by ID (admin only)
exports.updateUserID = [
  async (req, res) => {
    try {
      const { username, password } = req.body;
      const updateData = { username };

      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const updatedUser = await Register.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true } // Return the updated document
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        message: "User Credentials Updated",
        data: updatedUser,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  },
];

// Delete user by ID (admin only)
exports.deleteUser = [
  async (req, res) => {
    try {
      const userId = req.params.id;

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const deletedUser = await Register.findByIdAndDelete(userId);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        message: "User deleted successfully",
        data: deletedUser,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  },
];

// Logout function
exports.logout = [
  (req, res) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed." });
      }

      // Clear any token from cookies (if used)
      res.clearCookie("token");

      return res.status(200).json({ message: "Logout successful." });
    });
  },
];


// Admin dashboard
exports.admin = [
  (req, res) => {
    if (!req.session) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return res.status(200).json({ message: "Welcome to Admin Dashboard!" });
  },
];

// User dashboard
exports.user = [
  (req, res) => {
    if (!req.session) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return res.status(200).json({ message: "Welcome to User!" });
  },
];
