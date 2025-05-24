const Listing=require("../models/listing");
module.exports.index= async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewform=(req, res) => {
  res.render("listings/new.ejs");
}

module.exports.showlisting = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate({ path: "owner", select: "username" });

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing, currUser: req.user });
};


const axios = require("axios");

module.exports.createlisting = async (req, res, next) => {
  try {
    const { location } = req.body.listing;

    // 🧭 Forward geocode the location using Nominatim
    const geoRes = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: location,
        format: "json",
        limit: 1,
      },
      headers: {
        "User-Agent": "yourappname/1.0 (your-email@example.com)" // Required by Nominatim
      }
    });

    if (!geoRes.data || geoRes.data.length === 0) {
      throw new Error("Could not find coordinates for the given location.");
    }

    const lat = parseFloat(geoRes.data[0].lat);
    const lon = parseFloat(geoRes.data[0].lon);

    console.log(`📍 Coordinates for ${location}: [${lon}, ${lat}]`);

    const url = req.file.path;
    const filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    // 💾 Save image and coordinates
    newListing.image = {
      url: url,
      filename: filename,
    };

    newListing.geometry = {
      type: "Point",
      coordinates: [lon, lat], // [longitude, latitude]
    };

    await newListing.save();

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");

  } catch (err) {
    console.error("Error creating listing with geocoding:", err.message);
    next(err);
  }
};



module.exports.rendereditform =async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
   if(!listing){
   req.flash("error","Listing you requested for, does not exists!") 
  return res.redirect("/listings");
  }
  let orgImageurl=listing.image.url;
 orgImageurl= orgImageurl.replace("/upload","/upload/w_250")
  res.render("listings/edit.ejs", { listing ,orgImageurl});
}



module.exports.updatelisting = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  const newData = req.body.listing;

  // 🧭 If location is changed, geocode it
  if (newData.location && newData.location !== listing.location) {
    try {
      const geoRes = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
          q: newData.location,
          format: "json",
          limit: 1,
        },
        headers: {
          "User-Agent": "yourappname/1.0 (your-email@example.com)",
        }
      });

      if (geoRes.data && geoRes.data.length > 0) {
        const lat = parseFloat(geoRes.data[0].lat);
        const lon = parseFloat(geoRes.data[0].lon);
        newData.geometry = {
          type: "Point",
          coordinates: [lon, lat],
        };
      } else {
        req.flash("error", "Could not geocode the updated location.");
        return res.redirect(`/listings/${id}/edit`);
      }
    } catch (err) {
      console.error("Geocoding error during update:", err.message);
      req.flash("error", "Failed to fetch coordinates.");
      return res.redirect(`/listings/${id}/edit`);
    }
  }

  // 📝 Update listing with new data
  await Listing.findByIdAndUpdate(id, newData, { new: true, runValidators: true });

  // 💾 Update image if needed
  if (typeof req.file !== "undefined") {
    const url = req.file.path;
    const filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroylisting =async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
   req.flash("success", " Listing Deleted!");
  res.redirect("/listings");
}


module.exports.anchoritems = async (req, res) => {
  const { category } = req.query;
  let allListings;

  if (category) {
    allListings = await Listing.find({ category });
  } else {
    allListings = await Listing.find({});
  }

  res.render("listings/index.ejs", { allListings, category: category || "All" });
};
module.exports.searchbars = async (req, res) => {
  try {
    const { q } = req.query;

    // Check for empty or whitespace-only query
    if (!q || q.trim() === "") {
      req.flash("error", "Please enter a search term!");
      return res.redirect("/listings");
    }

    // Case-insensitive search for title, description, or location
    const regex = new RegExp(q.trim(), "i");

    const allListings = await Listing.find({
      $or: [
        { title: { $regex: regex } },
        { description: { $regex: regex } },
        { location: { $regex: regex } },
      ]
    });

    res.render("listings/index", {
      allListings,
      category: `Results for "${q}"`
    });
  } catch (err) {
    console.error("Search error:", err);
    req.flash("error", "Something went wrong while searching.");
    res.redirect("/listings");
  }
};

