const express = require('express');
const router = express.Router();
const ExpressError = require('../utils/ExpressError.js');
const wrapAsync = require('../utils/wrapAsync.js');
const { listingSchema, reviewSchema } = require('../schema.js');
const Listing = require('../models/listing.js');
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');

const listingController = require('../controllers/listings.js');

const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage }); // Configure multer to store uploaded files in the 'uploads' directory

router
    .route('/')
    //----------All lisiting home page ------------
    .get(wrapAsync(listingController.index))
    //---------create route----------------------------
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));

//---------Create listing page------------------
router.get('/new', isLoggedIn, wrapAsync(listingController.renderNewForm));

router
    .route('/:id')
    //---------Show listing details page----------------
    .get(wrapAsync(listingController.showListingDetails))
    //---Updating here----
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
    //----------Delete listing route----------------
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

//----------Edit listing page-------------------
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;
