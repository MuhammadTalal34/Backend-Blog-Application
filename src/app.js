const express = require("express");
const path = require("path");
const helmets = require("./middlewares/security");
const registerRouter = require("./routes/register");
const blogRouter = require("./routes/blog");
const cors = require('cors')
const app = express();
const compression = require('compression')

//  HELMET
// Help secure Express apps by setting HTTP response headers.
app.use(helmets);
// Compress body response 
app.use(compression());
// For Blocking Request To Different Domain
app.use(cors()) //cross-origin-resource-sharing


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
