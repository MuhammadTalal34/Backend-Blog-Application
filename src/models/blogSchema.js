const mongoose = require("mongoose");

// Define the schema for registering a user
const blogSchema = mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  img:
  {
      data: Buffer,
      contentType: String
  }
});

// Create the model from the schema
const Blog = mongoose.model("Blog", blogSchema);

// Export the model so it can be used in other files
module.exports = Blog;
