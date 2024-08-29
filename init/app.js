const mongoose = require('mongoose'); //mongo shell

const Data = require('./data.js'); //data of hotels

const Listing = require('../models/listings.js'); //schema

//mongo connection
main()
    .then((res)=>{
        console.log("mongoose connection successful");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');
      
};

//insert data into the listings collection
Listing.insertMany(Data.data).then((res) =>{
    console.log("saved");
}).catch((err) =>{
    console.log(err);
});