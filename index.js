const express = require('express');
const app = express();

const mongoose = require('mongoose');

const methodOverride = require("method-override");

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const session = require("express-session");

const flash = require("connect-flash");


const passport = require("passport");
const LocalStrategy = require("passport-local");

const userRouter = require("./routes/user.js");
const {isLoggedIn} = require("./middleware.js");

//databases
const Listing = require('./models/listings.js');
const Review = require('./models/review.js');
const User = require('./models/user.js');

//connection to mongoose server
main()
    .then((res) =>{
        console.log("mongodb connection successful");
    })
    .catch(err => console.log(err));


async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');

};


//ejs setup
const ejsMate = require("ejs-mate")
app.set("view engine","ejs");
app.engine("ejs",ejsMate);

const path = require("path");
app.set("views", path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use('/images', express.static('images'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));


//port
app.listen(8080,()=>{
    console.log("app listening on port: 8080");
});

//express-session
const sessionOptions = {
    secret: "code",
    resave: false,
    saveUninitialized: true,

    cookie:{
        expires: Date.now() + 7 *24 * 60 * 60 * 1000, //One Week
        maxAge: 7 *24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

//Passport js setup (middlewares)
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// USER ROUTE
app.use("/", userRouter);

//INDEX ROUTE
app.get("/listings",async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
});
app.get("/",async(req,res)=>{
    res.redirect("/listings");
})
//NEW/CREATE ROUTE
app.get("/listings/new", isLoggedIn, (req,res)=>{ 
    res.render("./listings/new.ejs");
});

app.post("/listings", async (req, res) => {
    try{
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success","New Listing Created!");
        res.redirect("/listings");
    }catch(err){
        next(err);
    }

});

//SHOW ROUTE
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");

    if(!listing){
        req.flash("error", "Listing does not exist!");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { listing });
});


//EDIT ROUTE
app.get("/listings/:id/edit", isLoggedIn, async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    
    if(!listing){
        req.flash("error", "Listing does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
});

//UPDATE ROUTE
app.put("/listings/:id", isLoggedIn, async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
});

//DELETE ROUTE
app.delete("/listings/:id", isLoggedIn, async (req,res)=>{
    let { id } =req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings"); 
});

//REVIEWS ROUTE
app.post("/listings/:id/reviews", async (req,res)=>{
    const listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review)

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    console.log("Review saved");
    req.flash("success","Review Added! ");
    res.redirect(`/listings/${listing._id}`);
});

//DELETE REVIEWS ROUTE
app.delete("/listings/:id/reviews/:reviewId", async (req,res)=>{
    let { id, reviewId } =req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success","Review Deleted! ");
    res.redirect(`/listings/${id}`); 
});



// ERROR MIDDLEWARE
app.use("*",async(err,req,res,next)=>{
    req.flash("success","Something went wrong!");
})
