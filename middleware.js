const Listing = require('./models/listing');
const Review = require('./models/review');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema, reviewSchema } = require('./schema.js');
const review = require('./models/review.js');


//------------------Authentication check----------------------
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectedUrl = req.originalUrl;
        req.flash('error', 'You must be signed in to do that.');
        return res.redirect('/login');
    }
    next();
};

//------------------Save redirected URL----------------------
module.exports.saveRedirectedUrl = (req, res, next) => {
    if (req.session.redirectedUrl) {
        res.locals.redirectedUrl = req.session.redirectedUrl;
        delete req.session.redirectedUrl;
    }
    next();
};

//------------------Ownership check----------------------
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate('owner');
    if (!listing.owner || !req.user._id.equals(listing.owner._id)) {
        req.flash('error', 'You are not the owner of this listing.');
        return res.redirect(`/listings/${id}`);
    }
    next();
};

//------------------Listing validation----------------------
module.exports.validateListing = async(req, res, next) => {
    const result = await listingSchema.validate(req.body);
    if (result.error) {
        throw new ExpressError(400, result.error.details.map((el) => el.message).join(', '));
    } else {
        next();
    }
};

//------------------Review validation----------------------
module.exports.validateReview = (req, res, next) => {
    const result = reviewSchema.validate(req.body);
    if (result.error) {
        throw new ExpressError(400, result.error.details.map((el) => el.message).join(', '));
    } else {
        next();
    }
};

//----------Review author check----------------------
module.exports.isReviewAuthor = async (req, res, next) => {
    let {reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author || !req.user._id.equals(review.author._id)){
        req.flash('error', 'You are not the author of this review.');
        return res.redirect(`/listings/${id}`);
    }
    next();
};
