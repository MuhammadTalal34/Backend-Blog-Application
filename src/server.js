const dotenv = require("dotenv");
const app = require("./app");
const createConnection = require("./dbConfig");

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
  createConnection();
});
