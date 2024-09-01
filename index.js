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

const {isLoggedIn, isOwner, isReviewAuthor} = require("./middleware.js");

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

//ROUTERS
const userRouter = require("./routes/user.js");
const reviewRouter = require("./routes/review.js");

//CONTROLLERS
const listingController = require("./controllers/listings.js");
const reviewController = require("./controllers/reviews.js");

//USER ROUTES
app.use("/", userRouter);

//REVIEW ROUTES
app.use("/listings/:id/reviews", reviewRouter);

//INDEX ROUTE
app.get("/listings",listingController.index);

app.get("/",async(req,res)=>{
    res.redirect("/listings");
})
//NEW/CREATE ROUTE
app.get("/listings/new", isLoggedIn, (req,res)=>{ 
    res.render("./listings/new.ejs");
});

app.post("/listings", listingController.createListing);

//SHOW ROUTE
app.get("/listings/:id",listingController.showListing );


//EDIT ROUTE
app.get("/listings/:id/edit", isLoggedIn, isOwner, listingController.editListing);

//UPDATE ROUTE
app.put("/listings/:id", isLoggedIn, isOwner, listingController.updateListing);

//DELETE ROUTE
app.delete("/listings/:id", isLoggedIn, isOwner, listingController.deleteListing);


//ERROR MIDDLEWARE
app.use("*",async(err,req,res,next)=>{
    req.flash("success","Something went wrong!");
})
