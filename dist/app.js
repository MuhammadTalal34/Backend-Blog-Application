"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv")); // Use import * as for dotenv
const express_1 = __importDefault(require("express")); // Use import * as for express
const path_1 = __importDefault(require("path")); // Use import * as for path
dotenv_1.default.config(); // Load environment variables from .env file
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000; // Fallback to port 3000 if not specified
// Configure Express to use EJS
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "ejs");
// Define a route handler for the default home page
app.get("/", (req, res) => {
    // Render the index template
    res.render("index");
});
// Start the express server
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
//# sourceMappingURL=app.js.map