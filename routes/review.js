const express=require("express");
const router=express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync=require("../utils/wrapasync.js");
const {validatereview,isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewcontroller=require("../controllers/reviews.js")
//reviews-post route
router.post("/",isLoggedIn,validatereview,wrapAsync( reviewcontroller.createreview));

//review-delete route
router.delete("/:reviewId",isReviewAuthor,wrapAsync(reviewcontroller.destroyreview))

module.exports=router;