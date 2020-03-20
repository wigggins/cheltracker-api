const express = require('express');
const Game = require('../models/Game');
const { getGameById, createGame, getGames } = require('../controllers/games');
const { checkAuth } = require('../middlewares/auth');
const router = express.Router();


router.route('/games').post(checkAuth, createGame);
router.route('/games').get(checkAuth, getGames);
router.route('/games/:gameId').get(checkAuth, getGameById);

module.exports = router;