const { campgroundSchema, reviewSchema } = require('./schemas.js')
const Campground = require('./models/campground');
const Review = require('./models/review')
const ExpressError = require('./utils/ExpressError');

// check if user is logged in or not
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; // don't think this work
        req.flash('error', 'You must be signed in');
        return res.redirect('/login'); //nah
    }
    next();
}

// check if user is author of campground
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!') 
        return res.redirect(`/campgrounds/${id}`) 
    }
    next();
}

// check if user is author of reviews
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!') 
        return res.redirect(`/campgrounds/${id}`) // prevent resent request form
    } 
    next();
}

// check validation of campground
module.exports.vaidateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// check validation of review
module.exports.vaidateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// store return to url (idk if this is necessary or can be used) -> update: this don't work anymore
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}





