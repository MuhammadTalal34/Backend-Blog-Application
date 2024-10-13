const Blog = require("../models/blogSchema");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define the uploads directory
const uploadsDir = path.join(__dirname, "uploads");

// Check if the directory exists, and create it if not
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage });

const blogController = {
  // Helper function for error responses
  sendErrorResponse(res, statusCode, message) {
    return res.status(statusCode).json({ error: message });
  },

  // Fetch all blogs
// Fetch all blogs
fetchBlog: async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json({
      message: "All Blogs Fetched",
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    console.error(error);
    this.sendErrorResponse(
      res,
      500,
      "An error occurred while fetching blogs."
    );
  }
},


  // Insert a new blog
// Insert a new blog
insertBlog: [
  upload.single("img"),
  async (req, res) => {
    try {
      if (!req.file) {
        return this.sendErrorResponse(res, 400, "Please send a file.");
      }

      const { title, description } = req.body;

      // Validate request body
      if (!title || !description) {
        return this.sendErrorResponse(
          res,
          400,
          "Title and Description are required."
        );
      }

      const obj = {
        title,
        description,
        img: {
          data: fs.readFileSync(path.join(uploadsDir, req.file.filename)),
          contentType: req.file.mimetype,
        },
      };

      // Create a new blog instance and save
      const newBlog = new Blog(obj);
      await newBlog.save();

      // Clean up uploaded file after saving
      fs.unlinkSync(path.join(uploadsDir, req.file.filename));

      res.status(201).json({
        message: "Blog Post Created",
        data: newBlog,
      });
    } catch (error) {
      if (error.code === 11000) {
        this.sendErrorResponse(
          res,
          400,
          "Title already exists. Please choose another one."
        );
      } else {
        console.error(error);
        this.sendErrorResponse(
          res,
          500,
          "An error occurred while creating the blog post."
        );
      }
    }
  },
],


  // Update an existing blog
 // Update an existing blog
// Update an existing blog
updateBlog: [
  upload.single("img"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description } = req.body;

      // Validate request body
      if (!title || !description) {
        return this.sendErrorResponse(
          res,
          400,
          "Title and Description are required."
        );
      }

      // Prepare the update object
      const updateData = { title, description };

      // Check if a new image is uploaded
      if (req.file) {
        // Read the new image file and store it
        updateData.img = {
          data: fs.readFileSync(path.join(uploadsDir, req.file.filename)),
          contentType: req.file.mimetype,
        };

        // Clean up the uploaded file after reading it
        fs.unlinkSync(path.join(uploadsDir, req.file.filename));
      }

      // Find and update the blog
      const updatedBlog = await Blog.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

      // Check if the blog exists
      if (!updatedBlog) {
        return this.sendErrorResponse(res, 404, "Blog not found.");
      }

      res.status(200).json({
        message: "Blog Post Updated",
        data: updatedBlog,
      });
    } catch (error) {
      if (error.code === 11000) {
        this.sendErrorResponse(
          res,
          400,
          "Title already exists. Please choose another one."
        );
      } else {
        console.error(error);
        this.sendErrorResponse(
          res,
          500,
          "An error occurred while updating the blog post."
        );
      }
    }
  },
],



  // Delete a blog
// Delete a blog
deleteBlog: async (req, res) => {
  try {
    const id = req.params.id;
    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (deletedBlog) {
      // Optional: Delete the associated image from the filesystem if needed
      const imagePath = path.join(uploadsDir, deletedBlog.img.filename);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      const countTotalBlogs = await Blog.countDocuments();
      return res.status(200).json({
        deletedBlog: deletedBlog._id,
        message: "Blog Post Deleted",
        remainingBlogs: countTotalBlogs,
      });
    }

    this.sendErrorResponse(res, 404, "Post Not Found. Invalid ID");
  } catch (error) {
    console.error(error);
    this.sendErrorResponse(
      res,
      500,
      "An error occurred while deleting the blog."
    );
  }
},

};

module.exports = blogController;
