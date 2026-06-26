const express = require("express");
const router = express.Router({ mergeParams: true });
const WrapAnsyc = require("../utils/wrapAsink.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const {validateReview,isLoggedIn,isreviewauthor }= require("../middlewere.js");
const reviewcontroller = require("../controller/review.js");


// post route
router.post("/",isLoggedIn , validateReview, WrapAnsyc(reviewcontroller.createreview))

// delete review route
router.delete("/:reviewId",isLoggedIn ,isreviewauthor , WrapAnsyc(reviewcontroller.destroyreview));


module.exports = router;