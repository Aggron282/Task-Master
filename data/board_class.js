const generateUniqueId = require('generate-unique-id');

class Board {

  constructor(config){
    this.name = config.name;
    this.subtitle = config.subtitle;
    this.background = config.background;
    this.list = [];
    this.id =  generateUniqueId();
  }

}



module.exports = Board;
