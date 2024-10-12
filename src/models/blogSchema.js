const mongoose = require("mongoose");

// Define the schema for registering a user
const blogSchema = mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
});

// Handle duplicate username error
blogSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new Error("Title already exists. Please choose another one."));
  } else {
    next();
  }
});

// Create the model from the schema
const Blog = mongoose.model("Blog", blogSchema);

// Export the model so it can be used in other files
module.exports = Blog;
