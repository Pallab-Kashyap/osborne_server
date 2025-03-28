const { Router } = require('express')
const { get_remote_token, logout, login } = require('../controller/authController');
const {deviceCount} = require('../middleware/deviceCountMiddleware');
const auth = require('../middleware/auth');

const router = Router();
router.route('/login').post(deviceCount, login)
router.route('/get_remote_token').get(auth, get_remote_token)
router.route('/logout').get( auth, logout)

module.exports = router