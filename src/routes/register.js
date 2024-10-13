const express = require("express");
const registerRouter = express.Router();
const registerController = require("../controllers/registerController");
const authorizeAdmin = require("../middlewares/authorizeAdmin");
const authenticateToken = require("../middlewares/authenticateToken");
const { rateLimit } = require("express-rate-limit");
const session = require("express-session");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Session configuration
registerRouter.use(
  session({
    secret: process.env.JWT_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 10, // 10 minutes
    },
  })
);

// Apply the rate limiting middleware to all requests.
registerRouter.use(limiter);

// Signup Route - No middleware needed (Public)
registerRouter.post("/signup", registerController.signup);

// Login Route - No middleware needed (Public)
registerRouter.post("/login", registerController.login);

// Get all users (Admin only) - Requires authentication and admin authorization
registerRouter.get(
  "/users",
  authenticateToken,
  authorizeAdmin,
  registerController.getUsers
);

// Get single user by ID (Admin only) - Requires authentication and admin authorization
registerRouter.get(
  "/user/:id",
  authenticateToken,
  authorizeAdmin,
  registerController.singleUser
);

// Update user credentials by ID (Admin only) - Requires authentication and admin authorization
registerRouter.put(
  "/user/:id",
  authenticateToken,
  authorizeAdmin,
  registerController.updateUserID
);

// Delete user by ID (Admin only) - Requires authentication and admin authorization
registerRouter.delete(
  "/user/:id",
  authenticateToken,
  authorizeAdmin,
  registerController.deleteUser
);

// Logout Route - Requires authentication to log out
registerRouter.post("/logout", authenticateToken, registerController.logout);

// Route that requires authentication for admin - Requires authentication and admin authorization
registerRouter.get(
  "/admin",
  authenticateToken,
  authorizeAdmin,
  registerController.admin
);

// Route that requires authentication for general users - Only requires authentication
registerRouter.get("/index", authenticateToken, registerController.user);

module.exports = registerRouter;
