const express = require("express");
const BlogRoutes = express.Router();
const blogController = require("../controllers/blogController");
const authenticateToken = require("../middlewares/authenticateToken");

BlogRoutes.get("/fetch-blog", authenticateToken , blogController.fetchBlog);

// Post Single Blog To Database
// http://localhost:3000/blog/insert-blog
BlogRoutes.post("/insert-blog", authenticateToken , blogController.insertBlog);
// Update The Blog
// http://localhost:3000/blog/update-blog/:id
BlogRoutes.put("/update-blog/:id", authenticateToken , blogController.updateBlog);

// Delete The Blog
// http://localhost:3000/blog/delete-blog/:id
BlogRoutes.delete("/delete-blog/:id", authenticateToken , blogController.deleteBlog);

module.exports = BlogRoutes;
