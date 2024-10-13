const Blog = require("../models/blogSchema");

const blogController = {
  // Fetch all blogs
  fetchBlog: [
    async (req, res) => {
      try {
        const fetchBlog = await Blog.find();
        res.status(200).json({
          message: "All Blogs Fetched",
          count: fetchBlog.length,
          data: fetchBlog,
        });
      } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({
          error: "An error occurred while fetching blogs.",
        });
      }
    },
  ],

  // Insert a new blog
  insertBlog: [
    async (req, res) => {
      try {
        const { title, description } = req.body;

        // Validate request body
        if (!title || !description) {
          return res.status(400).json({
            error: "Title and description are required.",
          });
        }

        // Create a new blog instance
        const insertBlog = new Blog({ title, description });

        // Attempt to save the blog
        await insertBlog.save();

        // Respond with success message if blog is created
        res.status(201).json({
          message: "Blog Post Created",
          data: insertBlog,
        });
      } catch (error) {
        if (error.code === 11000) {
          // Handle duplicate title error (MongoServerError)
          res.status(400).json({
            error: "Title already exists. Please choose another one.",
          });
        } else {
          console.error(error); // Log the error
          res.status(500).json({
            error: "An error occurred while creating the blog post.",
          });
        }
      }
    },
  ],

  // Update an existing blog
  updateBlog: [
    async (req, res) => {
      try {
        const { id } = req.params; // Assuming you're passing the blog ID in the URL
        const { title, description } = req.body;

        // Validate request body
        if (!title || !description) {
          return res.status(400).json({
            error: "Title and description are required.",
          });
        }

        // Find the blog by ID
        const updatedBlog = await Blog.findById(id);

        // Check if the blog exists
        if (!updatedBlog) {
          return res.status(404).json({ error: "Blog not found." });
        }

        // Update the fields
        updatedBlog.title = title;
        updatedBlog.description = description;

        // Save the updated blog
        await updatedBlog.save();

        // Respond with the updated blog
        res.status(200).json({
          message: "Blog Post Updated",
          data: updatedBlog,
        });
      } catch (error) {
        if (error.code === 11000) {
          // Handle duplicate title error
          res.status(400).json({
            error: "Title already exists. Please choose another one.",
          });
        } else {
          console.error(error); // Log the error
          res.status(500).json({
            error: "An error occurred while updating the blog post.",
          });
        }
      }
    },
  ],

  // Delete a blog
  deleteBlog: [
    async (req, res) => {
      try {
        const id = req.params.id;

        // Attempt to delete the blog by ID
        const deletedBlog = await Blog.findByIdAndDelete(id);

        // Check if a blog was deleted
        if (deletedBlog) {
          // Count total remaining blogs
          const countTotalBlogs = await Blog.countDocuments();

          // Respond with success message and count of remaining blogs
          return res.status(200).json({
            deletedBlog: deletedBlog._id,
            message: "Blog Post Deleted",
            RemainingBlogs: countTotalBlogs,
          });
        }

        // If no blog found with the provided ID
        res.status(404).json({
          message: "Post Not Found. Invalid ID",
        });
      } catch (error) {
        console.error(error); // Log the error
        // Respond with error message in case of an exception
        res.status(500).json({
          message: "An error occurred while deleting the blog.",
        });
      }
    },
  ],
};

module.exports = blogController;
