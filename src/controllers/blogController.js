const Blog = require("../models/blogSchema");
const blogController = {
    fetchBlog : [
        async (req, res) => {
            const fetchBlog = await Blog.find();
            if (fetchBlog) {
              res.status(200).json({
                message: "All Blogs Fetched",
                count: fetchBlog.length,
                data: fetchBlog,
              });
            }
          }
    ],
    insertBlog : [
        async (req, res) => {
            const { title, description } = req.body;
            const insertBlog = await new Blog({ title, description });
            insertBlog.save();
            if (insertBlog) {
              res.status(200).json({
                message: "Blog Post Created",
                data: insertBlog,
              });
            }
          }
    ],

    updateBlog:[
        async (req, res) => {
            const id = req.params.id;
            const { title, description } = req.body;
            const updatedBlog = await Blog.findByIdAndUpdate(
              { _id: id },
              { title: title, description: description }
            );
            updatedBlog.save();
            if (updatedBlog) {
              res.status(200).json({
                message: "Blog Post Updated",
                data: updatedBlog,
              });
            }
          }
    ],
    
    deleteBlog:[
        async (req, res) => {
            try {
              const id = req.params.id;
          
              // Attempt to delete the blog by ID
              const deletedBlog = await Blog.findByIdAndDelete(id);
          
              if (deletedBlog) {
                // Count total remaining blogs
                const totalBlogs = await Blog.find();
                const countTotalBlogs = totalBlogs.length;
          
                // Respond with success message and count of remaining blogs
                return res.status(200).json({
                  message: "Blog Post Deleted",
                  RemainingBlogs: countTotalBlogs,
                });
              }
          
              // If no blog found with the provided ID
              res.status(404).json({
                message: "Post Not Found. Invalid ID",
              });
            } catch (error) {
              console.log(error);
              // Respond with error message in case of an exception
              res.status(500).json({
                message: "An error occurred while deleting the blog. Debug Code",
              });
            }
          }
    ]
}
module.exports = blogController