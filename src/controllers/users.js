const asyncHandler = require("../middlewares/async");
const User = require('../models/User');

exports.getUsers = asyncHandler(async (req, res, next) => {
    const { query } = req; 
    const users = await User.find(query);

    if(!users) {
        return next({
            message: "No users could be found",
            statusCode: 404,
        });
    }

    const usersList = users.map(user => {
        return { 
            _id: user._id, 
            username: user.username
        };
    });

    return res.json({ usersList });
});

exports.getUser = asyncHandler(async (req, res) => {
    const { avatar, username, email, _id } = req.user;

    res.status(200).json({
      success: true,
      data: { avatar, username, email, _id },
    });
});