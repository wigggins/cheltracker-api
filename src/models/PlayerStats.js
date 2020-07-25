const mongoose = require('mongoose');

const playerStatsSchema = mongoose.Schema({
    userId: String,
    username: String,
    gamesPlayed: Number,
    gamesWon: Number,
    totalGoals: Number,
    totalShots: Number,
    totalHits: Number,
    totalPassing: Number,
    avgGoals: Number,
    avgShots: Number,
    avgHits: Number,
    avgPassing: Number,
    teamsPlayed: Object
}, { minimize: false });

module.exports = mongoose.model('PlayerStats', playerStatsSchema);