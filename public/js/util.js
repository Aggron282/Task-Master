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

function getRandomColorWithContrast() {
    // Generate random RGB
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    const backgroundColor = `rgb(${r}, ${g}, ${b})`;

    // Calculate relative luminance (per WCAG formula)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b);

    // Choose black or white text depending on luminance
    const textColor = luminance > 186 ? "#000000" : "#FFFFFF";

    return {
        background: backgroundColor,
        text: textColor
    };
}


const imageTypesAllowed = ['image/png', 'image/jpeg', 'image/jpg'];

const defaultAllowedTypes = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'text/csv',
];
