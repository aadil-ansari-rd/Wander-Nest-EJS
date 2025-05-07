const express = require('express');
const router = express.Router({mergeParams: true}); 
const Review = require('../models/Review.js')
const wrapAsync = require('../utils/wrapAsync.js')
const Listing = require('../models/Listing.js');
const reviewcontroller = require("../controllers/reviewcontroller.js")
const { validateReview, isLoggedin , isReviewAuthor } = require('../middleware.js');


//Post Review Route

router.post('/', isLoggedin,validateReview, wrapAsync(reviewcontroller.createReview))


//Delete review route

router.delete('/:reviewId', isLoggedin ,isReviewAuthor ,wrapAsync(reviewcontroller.destroyReview))






module.exports = router;