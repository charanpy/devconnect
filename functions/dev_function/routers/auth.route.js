const express = require('express');
const { register, getMe } = require('../controllers/auth.controller');
const checkAuth = require('../lib/middlewares/auth.middleware');
const router = express.Router();

router.route('/register').post(register);

router.route('/me').get(checkAuth, getMe);

module.exports = router;
