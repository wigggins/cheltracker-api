const express = require('express');
const User = require('../models/User');
const { login, signup } = require('../controllers/auth');

const router = express.Router();

router.route('/user/signup').post(signup);
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