const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const { listingSchema, reviewSchema } = require('../schema.js');
const ExpressError = require('../utils/ExpressError.js');

//------------------post review route------------------
module.exports.postReview = async (req, res) => {
    let id = req.params.id.trim();
    let ReviewObj = req.body.review;

    const listing = await Listing.findById(id);
    const review = new Review(ReviewObj);

    review.author = req.user._id;
    listing.reviews.push(review);

    await review.save();
    await listing.save();

    req.flash('success', 'Review added successfully.');
    res.redirect(`/listings/${id}`);
};

//------------------ review delete route ------------------
module.exports.deleteReview = async(req,res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully.");
    res.redirect(`/listings/${id}`);
};
