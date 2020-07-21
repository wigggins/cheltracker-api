const User = require("../models/User");
const PlayerStats = require('../models/PlayerStats');
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


exports.signup = asyncHandler(async (req, res) => {

    const user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });

    const token = user.getJwtToken();

    // Create new Player associated with User ID, 0 stats
    const player = await PlayerStats.create({
        userId: user._id,
        username: user.username,
        gamesPlayed: 0,
        gamesWon: 0,
        totalGoals: 0,
        totalShots: 0,
        totalHits: 0,
        totalPassing: 0,
        avgGoals: 0,
        avgShots: 0,
        avgHits: 0,
        avgPassing: 0,
        teamsPlayed: {}
    });

    res.status(201).send({ user, token });
});