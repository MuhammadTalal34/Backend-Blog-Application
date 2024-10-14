const mongoose = require("mongoose");

// Define the schema for registering a user
const registerSchema = mongoose.Schema({
  contact: { type: String, required: true },  // Ensure contact is required
  username: { type: String, required: true, unique: true },  // Ensure username is unique
  password: { type: String, required: true }, // Ensure password is required
  isAdmin: { 
    type: Boolean, 
    default: false // Default value is false
  }
}, { timestamps: true });

// Handle duplicate username error
registerSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('Username already exists. Please choose another one.'));
  } else {
    next();
  }
});


// Create the model from the schema
const Register = mongoose.model('Register', registerSchema);

// Export the model so it can be used in other files
module.exports = Register;
