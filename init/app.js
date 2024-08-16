const mongoose = require('mongoose');

const Data = require('./data.js');

const Listing = require('../models/listings.js');

main()
    .then((res)=>{
        console.log("mongoose connection successful");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');
      
};

Listing.insertMany(Data.data).then((res) =>{
    console.log("saved");
}).catch((err) =>{
    console.log(err);
});