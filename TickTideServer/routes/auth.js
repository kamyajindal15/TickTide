const jwt = require("jsonwebtoken");

// Replace with your secret key
const SECRET_KEY = "TickTide";

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header is missing" });
    }

    const token = authHeader.split(" ")[1]; // Extract the token (Assumes format: "Bearer <token>")
    if (!token) {
        return res.status(401).json({ message: "Token is missing" });
    }

    try {
        // Verify the token
        const user = jwt.verify(token, SECRET_KEY);
        req.user = user; // Attach user data to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

module.exports = authenticateToken;
