const Listing=require("./models/listing");
const Review=require("./models/review");
const ExpressError=require("./utils/expresserror.js");
const {listingschema}=require("./schema.js");
const {reviewschema}=require("./schema.js");
module.exports.isLoggedIn=(req,res,next)=>{
  if(!req.isAuthenticated()){
    //redirect url
    req.session.redirectUrl=req.originalUrl;
    req.flash("error","you must be logged in to create listing!");
     return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
if(req.session.redirectUrl){
    res.locals.redirectUrl= req.session.redirectUrl;
}
next();
}

module.exports.isowner=async(req,res,next)=>{
    let { id } = req.params;
let listing=await Listing.findById(id);
if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error","You are not the owner of this listing");
   return res.redirect(`/listings/${id}`);
}
next();
}

module.exports. validatelisting=(req,res,next)=>{
   let {error}= listingschema.validate(req.body);
   if(error){
    let errmsg=error.details.map((el)=>el.message).join(",");
   throw new ExpressError(400,errmsg);
 }
 else{
  next();
 }
}

module.exports.validatereview=(req,res,next)=>{
   let {error}= reviewschema.validate(req.body);
   if(error){
    let errmsg=error.details.map((el)=>el.message).join(",");
   throw new ExpressError(400,errmsg);
 }
 else{
  next();
 }
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    let { id,reviewId } = req.params;
let review=await Review.findById(reviewId);
if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","You are not the author of this review");
   return res.redirect(`/listings/${id}`);
}
next();
}