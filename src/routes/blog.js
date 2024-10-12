const express = require("express");
const BlogRoutes = express.Router();
const blogController = require("../controllers/blogController");

BlogRoutes.get("/fetch-blog", blogController.fetchBlog);

// Post Single Blog To Database
// http://localhost:3000/blog/insert-blog
BlogRoutes.post("/insert-blog", blogController.insertBlog);
// Update The Blog
// http://localhost:3000/blog/update-blog/:id
BlogRoutes.put("/update-blog/:id", blogController.updateBlog);

// Delete The Blog
// http://localhost:3000/blog/delete-blog/:id
BlogRoutes.delete("/delete-blog/:id", blogController.deleteBlog);

module.exports = BlogRoutes;
