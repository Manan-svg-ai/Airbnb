const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const { listingSchema, reviewSchema } = require('../schema.js');
const ExpressError = require('../utils/ExpressError.js');

///----------All lisiting home page ------------
module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render('Listings/listings.ejs', { allListings });
};

//---------NEW listing page------------------
module.exports.renderNewForm = async (req, res) => {
    res.render('Listings/new.ejs');
};

//---------create listing route----------------------------
module.exports.createListing =async (req, res) => {
    const listing = req.body.listing;
    listing.owner = req.user._id ;

    if (req.file) {
        let url = req.file.url;
        let filename = req.file.public_id;
        listing.image = { url, filename };
    }

    await Listing.create(listing);
    req.flash("success", "New listing created successfully.");
    res.redirect('/listings');
};


//----------Show listing details page----------------
module.exports.showListingDetails = async (req, res) => {
    const id = req.params.id.trim();
    let listing = await Listing.findById(id)
        .populate({ path: 'reviews', populate: { path: 'author' } })
        .populate('owner');
    console.log(listing);
    res.render('Listings/show.ejs', { listing });
};

//----------Edit listing page-------------------
module.exports.renderEditForm = async (req, res) => {

    const id = req.params.id.trim();
    let listing = await Listing.findById(id).populate('owner');

    let orignalImageUrl = listing.image.url;
    orignalImageUrl = orignalImageUrl.replace("/upload",`/upload/w_250`);

    res.render('Listings/edit.ejs', { listing , orignalImageUrl});
};

//---Updating here----
module.exports.updateListing = async (req, res) => {
    const listingObj = req.body.listing;
    const id = req.params.id.trim();
    let listing = await Listing.findByIdAndUpdate(id, listingObj, { new: true });

    if (req.file) {
        let url = req.file.url;
        let filename = req.file.public_id;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing updated successfully.");
    res.redirect(`/listings/${id}`);
};

//----------Delete listing route----------------
module.exports.deleteListing = async (req, res) => {
    const id = req.params.id.trim();
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully.");
    res.redirect("/listings");
};
