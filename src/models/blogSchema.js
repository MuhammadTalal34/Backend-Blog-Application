const mongoose = require("mongoose");
const { Schema } = mongoose; // Ensure you import Schema

// Define the schema for registering a user
const blogSchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    img: {
      data: Buffer,
      contentType: String,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Ensure this refers to your User model
  },
  { timestamps: true }
);

// Create the model from the schema
const Blog = mongoose.model("Blog", blogSchema);

// Export the model so it can be used in other files
module.exports = Blog;
