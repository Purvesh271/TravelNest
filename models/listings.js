const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default:
      "https://i.pinimg.com/564x/28/e9/2c/28e92ca1604f680e7ad4b1abf27dce9c.jpg",
    set: (v) =>
      v === ""
        ? "https://i.pinimg.com/564x/28/e9/2c/28e92ca1604f680e7ad4b1abf27dce9c.jpg"
        : v,
  },
  price: Number,
  location: String,
  country: String,

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ],

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;