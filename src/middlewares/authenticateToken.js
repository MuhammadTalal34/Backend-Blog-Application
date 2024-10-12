const jwt = require('jsonwebtoken');

// Middleware to authenticate tokens
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log("Incoming Token:", token); // Log the token
    
    if (!token) {
        return res.status(401).json({ message: "Token is missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded); // Log decoded token

        req.user = decoded; // Store the decoded data in req.user for further use
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

// Middleware to check if the user is an admin


module.exports =  authenticateToken ;
