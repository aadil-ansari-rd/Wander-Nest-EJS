const Listing = require("../models/Listing");

const index = async (req, res, next) => {
    let listings = await Listing.find({});
    res.render('./listings/index.ejs', { listings })
}

const renderNewForm = async (req, res, next) => {
    res.render('./listings/newListingPage.ejs')
}

const showListing = async (req, res, next) => {
    let id = req.params.id;
    // let listing = await Listing.findById(id).populate('review').populate("owner");  //Two populate 
    let listing = await Listing.findById(id).populate({    //Nesting Populate
        path: 'reviews',
        populate: {
            path: "author",
        },
    }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for , does not exit.")
        res.redirect('/listings')
    }
    res.render('./listings/show.ejs', { listing });
}

const createListing = async (req, res, next) => {


    let url = req.file.path;
    let filename = req.file.filename;

    let listing = new Listing(req.body.listing);
    listing.owner = req.user._id; //To store the object id in the listing.
    listing.image = { url, filename };
    await listing.save();
    req.flash("success", "New listing created! ")
    res.redirect('/listings')

}

const renderEditForm = async (req, res, next) => {
    let id = req.params.id;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for , does not exit.")
        res.redirect('/listings')
    }
    res.render('./listings/editListingPage.ejs', { listing })
}

const updateListing = async (req, res, next) => {
    let id = req.params.id;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing })

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }


    req.flash("success", "Listing updated! ")
    res.redirect(`/listings/${id}`);
}

const destroyListing = async (req, res, next) => {
    let id = req.params.id;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted! ")

    res.redirect('/listings')
}

module.exports = {
    index,
    renderNewForm,
    showListing,
    createListing,
    renderEditForm,
    updateListing,
    destroyListing
}