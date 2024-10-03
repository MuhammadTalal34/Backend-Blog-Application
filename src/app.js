const dotenv = require("dotenv"); // Use require for dotenv
const express = require("express"); // Use require for express
const path = require("path"); // Use require for path
const {createConnection} = require('./dbConfig')
dotenv.config(); // Load environment variables from .env file
const app = express();
const PORT = process.env.PORT || 3000; // Fallback to port 3000 if not specified

// Configure Express to use EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs"); 
// Within a Route We Can Get Data Using req.body from now on 
app.use(express.urlencoded({extended:false}))
// To access the public folder directories
 app.use(express.static("public"))
// Define a route handler for the default home page
app.get("/", (req, res) => {
  // Render the index template
  res.render("homepage");
});

// Route for the signup page
app.get("/signup", (req, res) => {
  // Render signup.ejs with isLogin set to false (for registration)
  res.render("register", { isLogin: false });
});

// Route for the login page
app.get("/login", (req, res) => {
  // Render signup.ejs with isLogin set to true (for login)
  res.render("register", { isLogin: true });
});


// Start the express server
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
  createConnection()
});
