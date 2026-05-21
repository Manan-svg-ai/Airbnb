const User = require('../models/user.js');

// ________________User controller functions___________
module.exports.renderSignupForm = (req, res) => {
    res.render('users/signup.ejs');
};

//______________ Handle user registration___________
module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body.user;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to WanderLust! Your account has been created successfully.');
            res.redirect('/listings');
        });
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/signup');
    }
};

//  ___________ Handle user login form rendering___________
module.exports.renderLoginForm = (req, res) => {
    res.render('users/login.ejs');
};

// ___________ Handle user login logic___________
module.exports.login = async (req, res) => {
    req.flash('success', 'Welcome back, ' + req.user.username + '!');
    res.redirect(res.locals.redirectedUrl || '/listings');
};

// ___________ Handle user logout logic___________
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'You are logged out !');
        res.redirect('/listings');
    });
};
