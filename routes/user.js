const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn, saveRedirectedUrl } = require('../middleware.js');
const userController = require('../controllers/users.js');

//_________________USER ROUTES_________________
router.get('/signup', userController.renderSignupForm);

//____________ Handle user registration_____________
router.post('/signup', userController.signup);

//____________ Handle user login_____________
router.get('/login', userController.renderLoginForm);

//____________ Handle user login with Passport.js_____________
router.post(
    '/login',
    saveRedirectedUrl,
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: 'Invalid username or password.'
    }),
    userController.login
);

//____________ Handle user logout_____________
router.get('/logout', userController.logout);

module.exports = router;
