const express = require('express');
const { getPlayerStats } = require('../controllers/playerstats');
const { checkAuth } = require('../middlewares/auth');

const router = express.Router();

router.route('/player/:playerId').get(checkAuth, getPlayerStats);

module.exports = router;