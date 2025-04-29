const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    name:{
      type:String,
      required:true
    },
    subtitle:{
      type:String,
      required:false
    },
    background:{
      type:String,
      required:true
    },
    background_img:{
      type:Object,
      required:false
    },
    isArchived:{
      type:Boolean,
      required:true
    },
    isFavorite:{
      type:Boolean,
      required:false
    },
    ownerID:{
      type:Schema.Types.ObjectId,
      required:true
    },
    description:{
      type:String,
      required:false
    },
    status:{
      type:Boolean,
      required:true
    },
    list:{
      type:Array,
      required:true
    }

  }

);

module.exports = mongoose.model("tasks",schema);
