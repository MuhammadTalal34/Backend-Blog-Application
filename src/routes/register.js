const express = require("express");
const registerRouter = express.Router();
const registerController = require("../controllers/registerController");
const authorizeAdmin = require("../middlewares/authorizeAdmin");
const authenticateToken = require("../middlewares/authenticateToken");
const { rateLimit } = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: true, // Uses the standardized headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});


// Apply the rate limiting middleware to all requests.
registerRouter.use(limiter);

// Signup Route
registerRouter.post("/signup", registerController.signup);

// Login Route
registerRouter.post("/login", registerController.login);

// Get all users (Admin only)
registerRouter.get("/users", registerController.getUsers , authorizeAdmin);

// Get single user by ID (Admin only)
registerRouter.get("/user/:id", registerController.singleUser, authorizeAdmin );

// Update user credentials by ID (Admin only)
registerRouter.put("/user/:id", registerController.updateUserID , authorizeAdmin);

// Delete user by ID (Admin only)
registerRouter.delete("/user/:id", registerController.deleteUser  , authorizeAdmin);

// Logout Route
registerRouter.post("/logout", registerController.logout);

// Route that requires authentication for admin
registerRouter.get(
  "/admin",
  authenticateToken,
  authorizeAdmin,
  registerController.admin
);

// Route that requires authentication for general users
registerRouter.get("/index", authenticateToken, registerController.user);

module.exports =  registerRouter ;
