const asyncHandler = require("../middlewares/async");
const PlayerStats = require('../models/PlayerStats');

exports.getPlayerStats = asyncHandler(async (req, res, next) => {
    const player = await PlayerStats.findOne({ userId: req.params.playerId });
        
    if(!player) {
        return next({
            message: `No player found for id ${req.params.playerId}`,
            statusCode: 404,
        });
    }

    res.status(200).json(player);
});