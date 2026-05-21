const express = require('express');
const router = express.Router({ mergeParams: true });
const ExpressError = require('../utils/ExpressError.js');
const wrapAsync = require('../utils/wrapAsync.js');
const { listingSchema, reviewSchema } = require('../schema.js');
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const { isLoggedIn, isOwner, validateListing, validateReview, isReviewAuthor } = require('../middleware.js');
const reviewController = require('../controllers/reviews.js');

//____________________post review route__________________
router.post('/', isLoggedIn, validateReview, wrapAsync(reviewController.postReview));

//____________________ review delete route ___________________
router.delete(
    '/:reviewId',
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.deleteReview)
);

module.exports = router;
