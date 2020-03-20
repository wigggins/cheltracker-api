const mongoose = require('mongoose');

const periodSchema = mongoose.Schema({
    goals: Number,
    shots: Number,
    hits: Number,
    timeOnAttack: Number,
    passing: Number,
    faceoffWins: Number,
    penaltyMinutes: Number,
    powerplayGoals: Number,
    powerplayChances: Number,
    shorthandedGoals: Number,
    isOvertime: Boolean
}, { _id: false });

const gameSchema = mongoose.Schema({
    home: {
        user: String,
        team: String,
        periods: [
            periodSchema
        ],
        final: periodSchema
    },
    visitor: {
        user: String,
        team: String,
        periods: [
            periodSchema
        ],
        final: periodSchema
    },
    shootout: Boolean,
    winner: String,
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Game', gameSchema);