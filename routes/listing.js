const express = require("express");
const router = express.Router();
const WrapAnsyc = require("../utils/wrapAsink.js");
const Listing = require("../models/listing.js");
const { isLoggedIn,isOwner,validateListing } = require("../middlewere.js");
const { findById } = require("../models/reviews.js");
const wrapAsink = require("../utils/wrapAsink.js");
const listingcontroller = require("../controller/listings.js")
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({storage})



router.route("/")
.get(wrapAsink(listingcontroller.index) )
.post( isLoggedIn,upload.single("listing[image][url]"), validateListing, WrapAnsyc(listingcontroller.createListing));

//New Route
router.get("/new", isLoggedIn, listingcontroller.rendernewform);

router.route("/:id")
.get(wrapAsink(listingcontroller.showListing) )
.put(isLoggedIn,isOwner,upload.single("listing[image][url]"), validateListing, WrapAnsyc(listingcontroller.updatListing))
.delete(isLoggedIn,isOwner, WrapAnsyc(listingcontroller.destroyListing));



//Edit Route
router.get("/:id/edit", isLoggedIn,isOwner, WrapAnsyc(listingcontroller.rendereditform));

module.exports = router;