const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local')
const mongoSanitize = require('express-mongo-sanitize');
const ExpressError = require('./utils/ExpressError');
const User = require('./models/user');
require('dotenv').config();
// const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'
const dbUrl = 'mongodb://localhost:27017/yelp-camp'
mongoose.connect(dbUrl);
const db = mongoose.connection;
db
    .on('error', console.error.bind(console, 'connection error:'))
    .once('open', () => {console.log('Database mongo atlas connected!!');});

const app = express();

// set view engine
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 



// const { name } = require('ejs');
app.use(express.urlencoded({ extended: true })); 
app.use(methodOverride('_method')); // override with POST having ?_method=DELETE or ?_method=PUT
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(mongoSanitize({replaceWith: '_'}));  // NoSQL injection protection

const secret = process.env.SECRET 
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60, // 1 day
    secret, 
});

// error handling althought it is not necessary
store.on('error', function (e) {
    console.log('Session Store Error', e)
})

const sessionConfig = {
    store, 
    name: 'session', 
    secret,
    resave: false, 
    saveUninitialized: true, // save session even if it is not initialized
    cookie: {
        httpOnly: true, 
        //secure: true, 
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, 
        maxAge: 1000 * 60 * 60 * 24 * 7, 
    }
}
app.use(session(sessionConfig));

// passport middleware
app.use(passport.initialize()); 
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser()); 
 
app.use(flash()); 
app.use((req, res, next) => {
    res.locals.currentUser = req.user; // null if not logged in
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Import routes
const campgroundsRoute = require('./routes/campgrounds');
const reviewsRoute = require('./routes/reviews');
const usersRoute = require('./routes/users');

// using route
app.use('/campgrounds', campgroundsRoute);
app.use('/campgrounds/:id/reviews', reviewsRoute);
app.use('/', usersRoute);

// Home page 
app.get('/', (req, res) => {
    res.render('home');
});

// 404
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404)); 
});

// middleware to handle error
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong';
    res.status(statusCode).render('error.ejs', { err });
});

const defaultPort = 3830;
app.listen(defaultPort, () => {
    console.log(`Listening on port ${defaultPort}`);
});