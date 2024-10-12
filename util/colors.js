const getPixels = require("get-pixels");
const { extractColors } = require("extract-colors");
const getColors = require('get-image-colors')

var path = require('path');

function ExtractColors(src,cb){

  // const options = {
  //   pixels: 64000,
  //   distance: 0.22,
  //   colorValidator: (red, green, blue, alpha = 255) => alpha > 250,
  //   saturationDistance: 0.2,
  //   lightnessDistance: 0.2,
  //   hueDistance: 0.083333333,
  // };
  // console.log(src);
  // extractColors(src, options).then((response)=>{
  //   console.log(response);
  //   cb(response);
  // }).catch((err)=>{
  //   console.log(err);
  // });

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
