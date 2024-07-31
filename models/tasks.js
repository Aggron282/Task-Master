const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    title:{
      type:String,
      required:true
    },
    subtitle:{
      type:String,
      required:true
    },
    background_img:{
      type:String,
      required:true
    },
    list:{
      type:[
        {
          listID:String,
          required:true
        },
        {
          item_title:String,
          required:true
        },
        {
          item_subtitle:String,
          required:true
        },
        {
          complete:Boolean,
          required:true
        }
    ],
      required:true

    }

  }

);

module.exports = mongoose.model("tasks",schema);
