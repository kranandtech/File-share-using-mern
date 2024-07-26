const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    try {
        const { authorization } = req.headers;

        // Check if Authorization header is missing
        if (!authorization) {
            return res.status(401).json({
                status: "fail",
                message: "Authorization header missing. Please include a valid token in the Authorization header.",
                data: {},
            });
        }
    
        // Extract token from Authorization header
        const token = authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                status: "fail",
                message: "Token not found. Please ensure the token is included in the Authorization header.",
                data: {},
            });
        }
    
        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    // Token has expired
                    return res.status(401).json({
                        status: "fail",
                        message: "Token has expired. Please log in again to obtain a new token.",
                        data: {},
                    });
                } else if (err.name === "JsonWebTokenError") {
                    // Invalid token
                    return res.status(401).json({
                        status: "fail",
                        message: "Invalid token. Please provide a valid token.",
                        data: {},
                    });
                } else {
                    console.error("JWT verify error:", err);
                    return res.status(401).json({
                        status: "fail",
                        message: "Unauthorized. An error occurred while verifying the token.",
                        data: {},
                    });
                }
            } else {
                // Token is valid
                req.user = {
                    email: decoded.data.email,
                    _id: decoded.data._id,
                };
                next();
            }
        });
    } catch (error) {
        console.error("Error in verifyToken middleware:", error);
        return res.status(500).json({
            status: "fail",
            message: "An error occurred while verifying the token.",
            data: {},
        });
        
    }
   
};

module.exports = verifyToken;
