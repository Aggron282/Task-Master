const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = require("mongodb").ObjectId;

const User = new Schema(
  {
    username:{
      type:String,
      required:true
    },
    name:{
      type:String,
      required:false
    },
    profilePicture:{
      type:String,
      required:false
    },
    password:{
      type:String,
      required:true
    },
    boards:{
      type:Array,
      required:true
    }

  }

);

module.exports = mongoose.model("users",User);
