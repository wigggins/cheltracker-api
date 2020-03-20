const User = require("../models/User");
const asyncHandler = require("../middlewares/async");

exports.login = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body;
    if(!email || !password) {
        res.status(400).send({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return next({
            message: "The email does not have an account.",
            statusCode: 400,
        });
    }

    const validLogin = await user.checkPassword(password);
    if (!validLogin) {
        return next({
            message: "Invalid password",
            statusCode: 400,
        });
    }

    const token = user.getJwtToken();

    res.status(201).send({ token });
});