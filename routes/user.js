const express = require("express");
const router = express.Router();
const User = require('../models/user.js');
const passport = require("passport");


//SignUP Route
router.get("/signup", (req,res) =>{
    res.render("users/signup.ejs");
});

router.post("/signup", async (req,res) =>{
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
    
        console.log(registeredUser);
        req.flash("success", "Welcome to TravelNest");
    
        res.redirect("/listings");
    }catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }
});

//LogIn Route
router.get("/login", (req,res) =>{
    res.render("users/login.ejs");
});

router.post("/login", passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), async (req,res) =>{
    try{
        req.flash("success", "Welcome back to TravelNest! ");
    
        res.redirect("/listings");
    }catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }
});

//LogOut Route
router.get("/logout", (req, res)=> {
    req.logout((err)=> {
        if(err){
            return next(err);
        }
        req.flash("success", "Logged Out! ");
        res.redirect("/listings");
    })
})

module.exports = router;