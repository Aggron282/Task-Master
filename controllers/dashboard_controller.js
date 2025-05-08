const User = require("./../models/users.js");
const Task = require("./../data/task_class.js");
const Board = require("./../models/tasks.js");

const generateUniqueId = require('generate-unique-id');
const path = require("path");
const board_util = require("./../util/board.js");

const SearchBoardsByName = async (req,res,next) => {

  var data = req.body;

  var search_name = data.search;

  const found_boards = await board_util.SearchBoardsByName(req.user.boards, search_name);

  if(found_boards.length > 0){
    res.json({error:null, boards:found_boards});
  }else{
    res.json({error:"No boards found", boards:req.user.boards });
  }

}

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

const ArchiveOneBoard = async (req,res,next) => {

  var data = req.body;

  var current_boards = [...req.user.boards];
  var new_boards = [];

  for (var i =0; i < current_boards.length; i++){

    if(JSON.stringify(current_boards[i]._id) == JSON.stringify(data._id)){
      current_boards[i].isArchived = true;
    }

    new_boards.push(current_boards[i]);

  }

  req.user.boards = new_boards;

  await User.replaceOne({username:req.user.username},req.user);

  res.json(true);

}

const FavoriteOneBoard = async (req,res,next) => {

  var data = req.body;

  var current_boards = [...req.user.boards];

  var new_boards = [];

  var isFavoriting = false;

  for (var i =0; i < current_boards.length; i++){

    if(JSON.stringify(current_boards[i]._id) == JSON.stringify(data.board_id)){

      current_boards[i].isFavorite = !current_boards[i].isFavorite;

      isFavoriting = current_boards[i].isFavorite;

    }

    new_boards.push(current_boards[i]);

  }

  req.user.boards = new_boards;
  console.log(isFavoriting)
  await User.replaceOne({username:req.user.username},req.user);

  res.json({isFavorite:isFavoriting});

}

const AddBoard = async (req, res, next) => {

  const board_config = req.body;

  const config = {
    subtitle: "",
    name: board_config.name,
    description: "",
    status: false,
    isArchived:false,
    background_img: req.file || null,
    background: board_config.background,
    list: [],
    isFavorite:false,
    ownerID: req.user._id,
  };

  var new_board = new Board(config);

  await new_board.save();

  const user = await User.findOne({ username: req.user.username });

  user.boards = [...user.boards, new_board];

  await User.replaceOne({ username: user.username }, user);

  req.user = user;

  res.redirect("/dashboard");
};


const CopyOneBoard = async (req, res, next) => {

  var {board_id} = req.body;
  var boards = [...req.user.boards];

  var {board} = await board_util.FindBoardById(boards,board_id);

  const user = {...req.user._doc};

  user.boards = [...user.boards, board];

  await User.replaceOne({ username: user.username }, user);

  req.user = user;

  res.json({error:null,board:board})

};

module.exports.AddBoard = AddBoard;
module.exports.SearchBoardsByName =SearchBoardsByName;
module.exports.DeleteOneBoard = DeleteOneBoard;
module.exports.ArchiveOneBoard = ArchiveOneBoard;
module.exports.CopyOneBoard = CopyOneBoard;
module.exports.FavoriteOneBoard = FavoriteOneBoard;
