const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");
const userschema=new Schema({
    email:{
        type:String,
        required:true
    },
});
userschema.plugin(passportLocalMongoose); // it will add hash username and salting atomatically
module.exports=mongoose.model('User',userschema);