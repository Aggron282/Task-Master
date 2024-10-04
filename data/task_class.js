const generateUniqueId = require('generate-unique-id');

class Task {

  constructor(data,query)
  {

    this.name = data.name;
    this.list = [];
    this.board = {
      name:query.name,
      id:query.board
    }

    this._id = generateUniqueId();

  }

}


module.exports = Task;
