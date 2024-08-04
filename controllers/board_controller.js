var path = require("path");
const User = require("./../models/users.js");
const Board = require("./../data/board_class.js");
const generateUniqueId = require('generate-unique-id');

const AddBoard = (req,res,next)=>{

  var board_heading = req.body;

  var config = {
    subtitle:"",
    name:board_heading.name,
    background:board_heading.background,

  }

  var new_board = new Board(config);

  User.findOne({username:req.user.username}).then((result)=>{

     result.boards = [...result.boards, new_board];

     User.replaceOne({username:result.username},result).then((output)=>{
        res.json(result);
     });

  });

}

const GetMyBoardPage = (req,res,next) => {
  res.sendFile(path.join(__dirname,"..","public","board.html"));
}

module.exports.AddBoard = AddBoard;
module.exports.GetMyBoardPage = GetMyBoardPage;
