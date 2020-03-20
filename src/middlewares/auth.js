const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.checkAuth = async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if(!token) {
        return next({
            status: 403,
            message: "Forbidden: you must be logged in"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return next({ message: `No user found for ID ${decoded.id}` });
        }

        req.user = user;
        next();
    } catch (err) {
        next({
        message: "You need to be logged in to visit this route",
        statusCode: 403,
        });
    }
};