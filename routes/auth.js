const express = require('express');
const router = express.Router();
const {userSignupValidator} = require('../validator');

const {
    register,
    login,
    logout,
    requireSignin
} = require('../controllers/auth');

router.post('/register', userSignupValidator, register);
router.post('/login', login);
router.get('/logout', logout);


module.exports = router;