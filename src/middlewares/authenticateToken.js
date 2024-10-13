const jwt = require('jsonwebtoken');

// Middleware to authenticate tokens
const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization') || req.header('authorization'); // Case-insensitive header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Authorization header missing or malformed" });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log("Incoming Token:", token); // Log the token for debugging
    
    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded); // Log the decoded token for debugging
        
        // Store decoded token data in req.user for further use
        req.user = decoded;
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error(err); // Log the error for debugging purposes
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = authenticateToken;
