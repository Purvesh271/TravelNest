const express = require('express');
const app = express();

const mongoose = require('mongoose');

const methodOverride = require("method-override");


//databases
const Listing = require('./models/listings.js');

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


//INDEX ROUTE
app.get("/listings",async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
});
app.get("/",async(req,res)=>{
    res.redirect("/listings")
})
//NEW/CREATE ROUTE
app.get("/listings/new", (req,res)=>{
    res.render("./listings/new.ejs");
});

app.post("/listings", async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

//SHOW ROUTE
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs", { listing });
});


//EDIT ROUTE
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
});

//UPDATE ROUTE
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
});

//DELETE ROUTE
app.delete("/listings/:id", async (req,res)=>{
    let { id } =req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings"); 
});


// ERROR MIDDLEWARE
app.use("*",async(err,req,res,next)=>{
    
})
