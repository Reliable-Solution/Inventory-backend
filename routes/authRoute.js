const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserByEmail, getAllAdmins } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/getuser',getUserByEmail)
router.get('/getalladmins',getAllAdmins)

module.exports = router;
