var path = require("path");
const User = require("./../models/users.js");
const Board = require("./../data/board_class.js");

const AddBoard = (req,res,next)=>{

  var board_heading = req.body;

  var config = {
    subtitle:"",
    name:board_heading.name,
    background:board_heading.background
  }

  var new_board = new Board(config);

  console.log(new_board);

  res.json(new_board);

}


module.exports.AddBoard = AddBoard;
