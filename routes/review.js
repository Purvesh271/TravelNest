const express = require("express");
const router = express.Router({ mergeParams: true});
const Listing = require('../models/listings.js');
const Review = require('../models/review.js');

const {isLoggedIn, isOwner, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");


//REVIEWS ROUTE
router.post("/", isLoggedIn, reviewController.createReview );

//DELETE REVIEWS ROUTE
router.delete("/:reviewId",isReviewAuthor, reviewController.deleteReview);

module.exports = router;