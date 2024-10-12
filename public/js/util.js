function GetAllColorsInImage(image_data) {

  var data = [];

  for(var i =0; i < image_data.length; i+= 4){

    var rgb_data = {
      r:image_data[i],
      g:image_data[i + 1],
      b:image_data[i + 2],
    }

    data.push(rgba_data);

  }

  return data;

}
