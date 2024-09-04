//contains the core functionality of backend (all async functions and logics)

const Listing = require("../models/listings");

//index route
module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
};

//create route
module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    try{
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;

        newListing.image = {url,filename};
        
        await newListing.save();
        req.flash("success","New Listing Created!");
        res.redirect("/listings");
    }catch(err){
        req.flash("error",err);
        next(err);
    }

};

//search route
module.exports.search = async (req, res) => {
    const { query } = req.query;

    try {
        const foundListings = await Listing.find({
            country: { $regex: query, $options: "i" } // Search by country only
        });

        if (foundListings.length === 0) {
            req.flash("error", "No listings found in the specified country.");
            return res.redirect("/listings");
        }

        res.render("./listings/search.ejs", { foundListings });
    } catch (err) {
        req.flash("error", "An error occurred during the search.");
        console.error(err);
        res.redirect("/listings");
    }
};


//show route
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: { path: "author" }
    }).populate("owner");

    if (!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }

    res.render("./listings/show.ejs", { listing });
};

//edit route
module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    
    if(!listing){
        req.flash("error", "Listing does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
};

//update route
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }

    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

//delete route
module.exports.deleteListing = async (req,res)=>{
    let { id } =req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings"); 
};