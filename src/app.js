const express = require("express");
const path = require("path");
const securityMiddleware = require("./middlewares/security");
const registerRouter = require("./routes/register");
const blogRouter = require("./routes/blog");

const app = express();

// Apply security middleware
app.use(securityMiddleware);

// Set view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Body parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files
app.use(express.static("public"));

// Define routes
app.use("/api", registerRouter);
app.use("/blog", blogRouter);

module.exports = app;
