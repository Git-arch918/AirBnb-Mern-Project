const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: String,
    url: String
  },
  price: Number,
  location: String,
  country: String,

  // 🧭 Add this for geolocation
  geometry: {
    type: {
      type: String,
      enum: ["Point"], // GeoJSON requires this
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },

  reviews: [{
    type: Schema.Types.ObjectId,
    ref: "Review",
  }],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
category: {
    type: String,
    required: true,
    enum: [
      'Trending',
      'Rooms',
      'Iconic Cities',
      'Mountains',
      'Castles',
      'Amazing Pools',
      'Camping',
      'Farms',
      'Arctic',
      'Domes',
      'Boats'
    ]
  }  
});

// 🧹 Cascade delete reviews
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
