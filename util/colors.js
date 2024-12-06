const getPixels = require("get-pixels");
const { extractColors } = require("extract-colors");
const getColors = require('get-image-colors')
const path = require('path');

function ExtractColors(src,cb){

  getColors(path.join(__dirname,"..","public", "images" ,src)).then(colors => {

    var rgba = colors.map((color)=>{

      var rgb = {
        r: color._rgb[0],
        g: color._rgb[1],
        b: color._rgb[2]
      }

      return rgb;

    });

    cb(rgba)

  })

}


module.exports.ExtractColors = ExtractColors;
