const express = require('express');
const { loginUser, signUpUser } = require('../controllers/userControlller');

const router = express.Router();

router.post('/login', loginUser);
router.post('/signup', signUpUser);

module.exports = router;
