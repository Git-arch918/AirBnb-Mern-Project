const mongoose = require("mongoose");
const axios = require("axios");
const initData = require("./Data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Allowed categories from schema
const categories = [
  "Trending",
  "Rooms",
  "Iconic Cities",
  "Mountains",
  "Castles",
  "Amazing Pools",
  "Camping",
  "Farms",
  "Arctic",
  "Domes",
  "Boats"
];

main()
  .then(() => {
    console.log("connected to DB");
    return initDB();
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const geocodeLocation = async (location) => {
  try {
    const res = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: `${location}, ${obj.country}`,
        format: "json",
        limit: 1
      },
      headers: {
        "User-Agent": "wanderlust-app (your-email@example.com)" // update for production
      }
    });

    if (res.data.length > 0) {
      const { lat, lon } = res.data[0];
      return {
        type: "Point",
        coordinates: [parseFloat(lon), parseFloat(lat)]
      };
    } else {
      return {
        type: "Point",
        coordinates: [0, 0]
      };
    }
  } catch (error) {
    console.error("Geocoding error:", error.message);
    return {
      type: "Point",
      coordinates: [0, 0]
    };
  }
};

const User = require("../models/user.js");

const initDB = async () => {
  await Listing.deleteMany({});

  const user = await User.findOne(); // Get any existing user
  if (!user) {
    throw new Error("No users found in the database. Please seed users first.");
  }

  let categoryIndex = 0;

  for (let i = 0; i < initData.data.length; i++) {
    const obj = initData.data[i];
    const geometry = await geocodeLocation(obj.location);

    const assignedCategory = categories[categoryIndex];
    categoryIndex = (categoryIndex + 1) % categories.length;

    const listing = new Listing({
      ...obj,
      category: assignedCategory,
      owner: user._id, // ✅ assign valid user ID
      geometry
    });

    await listing.save();
    console.log(`Saved: ${listing.title} (${assignedCategory})`);
  }
};

 