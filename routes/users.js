const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const users = require('../controllers/users');


router.route('/register')
.get(users.renderRegister)
.post(catchAsync(users.createNewUser));



// router.get('/register',users.renderRegister);

// router.post('/register',catchAsync(users.createNewUser));

router.route('/login')
.get(users.renderLogin)
.post(passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),users.login);

// router.get('/login',users.renderLogin);

// router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),users.login);

router.get('/logout',users.logout);

module.exports = router;