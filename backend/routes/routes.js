const express = require('express');
const router = express.Router(); 

const { signup, login, logout } = require('../controllers/auth');
const { sendMessage, getMessage, sendAttachment } = require('../controllers/message');
const { auth } = require('../middlewares/auth');
const { getAllusers, getMyProfile, updateProfilePic } = require('../controllers/UserHandlers');
 
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout)

router.post('/sendMessage/:id', auth, sendMessage);
router.post('/sendAttachment/:id', auth, sendAttachment);
router.get('/getMessage/:id', auth, getMessage);

router.get('/allUsers', auth, getAllusers);

router.get('/myProfile', auth, getMyProfile);
router.post('/updateProfilePic', auth, updateProfilePic);

module.exports = router;