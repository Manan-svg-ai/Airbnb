if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');

const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Listing = require('./models/listing.js');
const methodoverride = require('method-override');
const ejsMate = require('ejs-mate');

const ExpressError = require('./utils/ExpressError.js');
const { error } = require('console');

const Review = require('./models/review.js');

const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');

const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo').default;

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

const dbUrl = process.env.ATLASDB_URL;

//_________________________Functions_____________________________

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 60 * 60
});

store.on('error', (err) => {
    console.error('Session store error:', err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
};

//_________________________middleware_____________________________

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'init', 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
app.use(methodoverride('_method'));
app.engine('ejs', ejsMate);

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
});

//_________________________ database connection _____________________________

async function main() {
    await mongoose.connect(dbUrl, { dbName: 'wanderlust' });
    console.log('Connected to MongoDB Atlas');
}

//_________________________ routes _____________________________

// app.get("/demouser" , async(req,res)=>{
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student"
//     });
//     let registeredUser = await User.register(fakeUser,"password");
//     res.send(registeredUser);
// });

app.use('/listings', listingRouter);

app.use('/listings/:id/reviews', reviewRouter);

app.use('/', userRouter);

//index route
app.get('/', (req, res) => {
    res.redirect('/listings');
});

//____________________ error handling _____________________________

app.use((req, res, next) => {
    next(new ExpressError(404, 'Page Not found'));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = 'some error' } = err;
    res.render('error.ejs', { err });
    // res.status(statusCode).send(message);
});

//_________________________ server _____________________________

main()
    .then(() => {
        app.listen(8080, () => {
            console.log('Server is running on port 8080');
        });
    })
    .catch((err) => {
        console.log('Error connecting to MongoDB', err);
    });
