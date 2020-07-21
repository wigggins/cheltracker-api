const express = require('express');
const { login, signup } = require('../controllers/auth');
const { getUsers } = require('../controllers/users');
const { checkAuth } = require('../middlewares/auth');

const router = express.Router();

router.route('/user/signup').post(signup);
router.route('/user/login').post(login);
router.route('/users').get(checkAuth, getUsers);

module.exports = router;