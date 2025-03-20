const User = require("./../models/users.js");
const Task = require("./../data/task_class.js");
const Board = require("./../models/tasks.js");

const generateUniqueId = require('generate-unique-id');
const path = require("path");

const DeleteOneBoard = async (req,res,next) => {

  var data = req.body;

  await Board.deleteOne({_id:data._id});

  var current_boards = [...req.user.boards];
  var new_boards = [];

  for (var i =0; i < current_boards.length; i++){

    if(JSON.stringify(current_boards[i]._id) != JSON.stringify(data._id)){
      new_boards.push(current_boards[i]);
    }

  }

  req.user.boards = new_boards;

  await User.replaceOne({username:req.user.username},req.user);

  res.json(true);

}

const AddBoard = async (req,res,next)=>{

  const color = Object.keys(req.body)[0];

  const board_config = req.body;

  board_config.thumbnail = req.file;

  var config = {
    subtitle:"",
    name:board_config.name,
    description:"",
    status:false,
    background_img: board_config.thumbnail,
    background:color,
    list:[],
    ownerID: req.user._id,
  }

  var new_board = new Board(config);

  await new_board.save();

  User.findOne({username:req.user.username}).then(async (result)=>{

     result.boards = [...result.boards, new_board];

     await User.replaceOne({username:result.username},result);

     req.user = result;

     res.redirect("/dashboard");

  });

}



module.exports.AddBoard = AddBoard;
module.exports.DeleteOneBoard = DeleteOneBoard;
