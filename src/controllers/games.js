const asyncHandler = require("../middlewares/async");
const Game = require('../models/Game');
const PlayerStats = require('../models/PlayerStats');
const User = require("../models/User");
const createAvg = require('../utils/createAvg');
const processPeriods = require('../utils/processPeriods');

exports.getGameById = asyncHandler(async (req, res, next) => {
    const game = Game.findById(req.params.gameId);

    if(!game) {
        return next({
            message: `No game found for id ${req.params.gameId}`,
            statusCode: 404,
        });
    }
    
    return res.json(game);
});

exports.getGames = asyncHandler(async (req, res, next) => {
    const games = await Game.find({ $or: [ { 'home.user': req.user._id }, { 'visitor.user': req.user._id } ] });

    if(!games) {
        return next({
            message: `No games found for user ${req.user._id}`,
            statusCode: 404,
        });
    }
    
    return res.json(games);
});

exports.createGame = asyncHandler(async (req, res, next) => {
    const { home, visitor } = req.body;

    const game = new Game({
        home: {
            user: home.user,
            team: home.team,
            periods: processPeriods(home.periods),
            final: {
                ...home.periods[home.periods.length - 1]
            }
        },
        visitor: {
            user: visitor.user,
            team: visitor.team,
            periods: processPeriods(visitor.periods),
            final: {
                ...visitor.periods[visitor.periods.length - 1]
            }
        },
        shootout: req.body.shootout,
        winner: home.periods[home.periods.length - 1].goals > visitor.periods[home.periods.length - 1].goals ? home.user : visitor.user
    });

    const savedGame = await game.save();
    // if error saving game, throw.. error
    if(!savedGame) {
        return next({
            status: 500,
            message: "Error saving game"
        });
    }
    // update each players' stats record
    [ 'home', 'visitor' ].forEach(async stance => {
        let stats = await PlayerStats.findOne({ userId: savedGame[stance].user });
            
        if(!stats) {
            return next({
                status: 404,
                message: "Error finding user during player stats update"
            });
        }
        const final = savedGame[stance].final;

        const totals = {
            gamesPlayed: stats.gamesPlayed + 1,
            gamesWon: savedGame.winner === savedGame[stance].user ? stats.gamesWon + 1 : stats.gamesWon,
            totalGoals: stats.totalGoals + final.goals,
            totalShots: stats.totalShots + final.shots,
            totalHits: stats.totalHits + final.hits,
            totalPassing: stats.totalPassing + final.passing
        };

        // assign totals and averages
        // totals are kept track mostly for creating averages (i.e. lifetime total passing is just a huge number)
        // but it's also fun to see stuff like lifetime hits
        stats.gamesPlayed = totals.gamesPlayed;
        stats.gamesWon = totals.gamesWon;
        stats.totalGoals = totals.totalGoals;
        stats.totalShots = totals.totalShots;
        stats.totalHits = stats.totalHits + final.hits;
        stats.totalPassing = stats.totalPassing + final.passing;
        stats.avgGoals = createAvg(totals.gamesPlayed, totals.totalGoals);
        stats.avgShots = createAvg(totals.gamesPlayed, totals.totalShots);
        stats.avgHits = createAvg(totals.gamesPlayed, totals.totalHits);
        stats.avgPassing = createAvg(totals.gamesPlayed, totals.totalPassing);
        stats.teamsPlayed = Object.assign({}, stats.teamsPlayed, { 
            [savedGame[stance].team]: stats.teamsPlayed[savedGame[stance].team] + 1 || 1 
        });

        const savedStats = await stats.save();

        if(!savedStats) {
            return next({
                status: 500,
                message: `Error saving stats for user ${savedGame[stance].user}`
            });
        }
     });

    res.status(201).send({ game });
});