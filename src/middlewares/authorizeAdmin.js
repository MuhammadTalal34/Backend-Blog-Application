const authorizeAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        console.log("User from token:", req.user); // Log the user object

        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next(); // User is admin, proceed to the next middleware or route handler
};
module.exports = authorizeAdmin