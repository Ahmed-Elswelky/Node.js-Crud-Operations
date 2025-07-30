const errorCreation = require("../utils/appError");
const httpStatus = require("../utils/httpStatus");

module.exports = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user.role;
        console.log(allowedRoles, userRole);
        
        if (!allowedRoles.includes(userRole)) {
        const error = errorCreation.createError(    
            "You do not have permission to access this resource",
            httpStatus.FORBIDDEN.code
        );
        return next(error);
        }
        next();
    };
}