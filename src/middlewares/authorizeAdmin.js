const authorizeAdmin = (req, res, next) => {
    // Check if the user exists and if they are an admin
    if (!req.user || !req.user.isAdmin) {
        console.log("User from token:", req.user); // Log the user object for debugging
        
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    
    next(); // User is an admin, proceed to the next middleware or route handler
};

module.exports = authorizeAdmin;
