const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_Token;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
module.exports.index = async (req, res) => {
    let search = req.query.search;
    let category = req.query.category;
    let allListings;

    if (search && search.trim() && category) {
        allListings = await Listing.find({
            $and: [
                {
                    $or: [
                        { title: { $regex: search, $options: "i" } },
                        { location: { $regex: search, $options: "i" } },
                        { country: { $regex: search, $options: "i" } },
                    ],
                },
                {
                    category,
                },
            ],
        });
    }

    else if (search && search.trim()) {
        allListings = await Listing.find({
            $or: [
                {
                    title: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    location: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    country: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ],
        });
    }

    else if (category) {
        allListings = await Listing.find({
            category,
        });
    }

    else {
        allListings = await Listing.find({});
    }

    res.render("listings/index.ejs", {
        allListings,
    });
};

module.exports.rendernewform = (req, res) => {

    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "listing you are excess does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    })
        .send();


    if (!req.body.listing.image?.url) {
        delete req.body.listing.image;
    }
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry;
    let sevedListing = await newListing.save();
    console.log(sevedListing);
    req.flash("success", "new listing created!")
    res.redirect("/listings");
};

module.exports.rendereditform = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "listing you are excess does not exist");
        return res.redirect("/listings");
    }
    let orignalImageUrl = listing.image.url;
    orignalImageUrl = orignalImageUrl.replace("/upload", "/upload/h_150,w_150")
    res.render("listings/edit.ejs", { listing, orignalImageUrl });
};

module.exports.updatListing = async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findById(id);

    // Update geometry only if location changed
    if (listing.location !== req.body.listing.location) {
        let response = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
        }).send();

        req.body.listing.geometry = response.body.features[0].geometry;
    }

    listing = await Listing.findByIdAndUpdate(
        id,
        req.body.listing,
        {
            new: true,
            runValidators: true,
        }
    );

    // Update image only if a new image is uploaded
    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename,
        };

        await listing.save();
    }

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "listing deleted!")
    res.redirect("/listings");
};