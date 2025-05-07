const express = require('express');
const router = express.Router()
const Listing = require('../models/Listing.js')
const wrapAsync = require('../utils/wrapAsync.js')
const { validateListing, isLoggedin, isOwner } = require("../middleware.js")
const listingcontroller = require("../controllers/listingcontroller.js")
const multer  = require('multer');
const { storage } = require('../cloudConfig.js');

const upload = multer({storage,
    limits: { fileSize: 15 * 1024 * 1024 }, // Set a size limit (5MB in this example)
});


//Index Route
router.get('/', wrapAsync(listingcontroller.index))


//Create new listing

router.route("/new")
.get(isLoggedin, wrapAsync(listingcontroller.renderNewForm))
.post(isLoggedin, upload.single("image") ,validateListing,   wrapAsync(listingcontroller.createListing))


//Edit a listing

router.route('/:id/edit')
.get( isLoggedin, isOwner, wrapAsync(listingcontroller.renderEditForm))
.put(isLoggedin, isOwner, upload.single("image") , validateListing, wrapAsync(listingcontroller.updateListing))


//Show Specific Hotel
//Delete a listing

router.route('/:id')
.get(wrapAsync(listingcontroller.showListing))
.delete( isLoggedin, isOwner, wrapAsync(listingcontroller.destroyListing))




// //Index Route
// router.get('/', wrapAsync(listingcontroller.index))


// //Create new listing
// router.get('/new',  isLoggedin , wrapAsync(listingcontroller.renderNewForm))

// router.post('/new',  isLoggedin ,  validateListing, wrapAsync(listingcontroller.createListing))


// //Show Specific Hotel

// router.get('/:id', wrapAsync(listingcontroller.showListing))


// //Edit a listing

// router.get('/:id/edit', isLoggedin ,isOwner, wrapAsync(listingcontroller.renderEditForm))

// router.put('/:id/edit',  isLoggedin ,isOwner,  validateListing, wrapAsync(listingcontroller.updateListing))


// //Delete a listing
// router.delete('/:id',  isLoggedin ,isOwner,  wrapAsync(listingcontroller.destroyListing))



module.exports = router;