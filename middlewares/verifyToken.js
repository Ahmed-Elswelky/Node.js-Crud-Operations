const jwt = require('jsonwebtoken');
const httpStatus = require('../utils/httpStatus');
const config = require('../config/config');
const env = config[process.env.NODE_ENV || 'development'];


const verifyToken = (req, res, next) => {
    const receivedToken = req.headers.authorization;
    const token = receivedToken && receivedToken.startsWith('Bearer ') ? receivedToken.split(' ')[1] : null;

    console.log(token);
    
    if (!token) {
        return res.status(httpStatus.UNAUTHORIZED.code).json({ status: httpStatus.UNAUTHORIZED.message, message: "No token provided" });
    }
    try {
        const decoded = jwt.verify(token, env.jwt_secret);
        req.user = decoded.user;
        console.log("Decoded user:", req.user);
    } catch (error) {
        return res.status(httpStatus.FORBIDDEN.code).json({ status: httpStatus.FORBIDDEN.message, message: "Invalid token" });
    }
    next();
};

module.exports = verifyToken;