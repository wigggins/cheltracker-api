const express = require('express');
const User = require('../models/User');
const PlayerStats = require('../models/PlayerStats');
const { login } = require('../controllers/auth');

const router = express.Router();

router.route('/user/signup')
    .post((req, res) => {
        try {
            // Create the new user and save
            const user = new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            });
            user.save((err, newUser) => {
                if(err) {
                    return err;
                }
                // Create new Player associated with User ID, 0 stats
                const player = new PlayerStats({
                    userId: newUser._id,
                    username: newUser.username,
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
                player.save();
            });

            const token = user.getJwtToken();

            res.status(201).send({ user, token });
        } catch(err) {
            res.status(400).send(err);
        }
    });

router.route('/user/login').post(login);

router.route('/users')
    .get((req, res) => {
        const { query } = req; 
        User.find(query, (err, users) => {
            if(err) {
                return res.send(err);
            }
            const userList = users.map(user => {
                return { 
                    _id: user._id, 
                    username: user.username
                };
            });
            return res.json(userList);
        });
    });

module.exports = router;