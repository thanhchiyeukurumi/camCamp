if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
require('dotenv').config();
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
const helmet = require('helmet');
const ExpressError = require('./utils/ExpressError');
const User = require('./models/user');

// const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'
const dbUrl = 'mongodb://localhost:27017/yelp-camp'
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {console.log('Database mongo atlas connected!!');});

const app = express();

// set view engine
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // folder views has all the ejs files



const { name } = require('ejs');
app.use(express.urlencoded({ extended: true })); 
app.use(methodOverride('_method')); // override with POST having ?_method=DELETE or ?_method=PUT
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(mongoSanitize({replaceWith: '_'}));  // NoSQL injection protection

// using mongo to store session
const secret = process.env.SECRET || 'hhhhjjdjdjdjdjdsecret!';
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

app.use(helmet());
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", 
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", 
];
const connectSrcUrls = [
    "https://api.maptiler.com/", 
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [], // zenzen no default source
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dsimlypyu/", 
                "https://images.unsplash.com/",
                "https://api.maptiler.com/",
                "https://nrs.objectstore.gov.bc.ca"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

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
const port = process.env.PORT || defaultPort; // why having env.PORT here?
app.listen(port, () => {
    console.log(`Listening on port ${defaultPort}`);
});