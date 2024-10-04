const User = require("./../models/users.js");
const Board = require("./../data/board_class.js");
const Task = require("./../data/task_class.js");

const generateUniqueId = require('generate-unique-id');
const path = require("path");

const AddTaskList = (req,res,next) => {

  var data = req.body;
  var query = req.params;
  var new_task = new Task(data,query);
  var chosen_board = null;

  User.findOne({username:req.user.username}).then((result)=>{

    if(!result){
      res.json(false);
      return;
    }

    var boards = [...result.boards];
    var updated_user = result;

    for(var i = 0; i < boards.length; i++){

      var no_space_name = boards[i].name.replace(/\s/g, '');

      if(no_space_name == new_task.board.name && new_task.board.id == boards[i].id){

        chosen_board = boards[i];

        boards[i] = chosen_board;

        chosen_board.list = [...chosen_board.list, new_task];

        updated_user.boards = [...boards];

        User.replaceOne({username:result.username},updated_user).then((output)=>{

            if(!output){
              res.json(false);
              return;
            }
            if(chosen_board){
              res.json(updated_user.boards);
              return;
            }

            res.json(false);

        });

      }

    }

  });

}

async function FindBoardById(boards,id){

  for(var i =0; i < boards.length; i ++){

    if(id == boards[i].id){
      return {board:boards[i],index:i};
    }

  }

  return null;

}

const AddTaskToList = async (req,res,next) => {

  var body = req.body;
  var boards = req.user.boards;

  var board_ = await FindBoardById(boards,body.board_id);

  var index = board_.index;
  var found_board = board_.board;

  if(!found_board){
      throw new Error("Could not find board");
    }

  var new_board = {...found_board};
  var list_index = 0;

  var found_list = found_board.list.map((list,i)=>{

  if(list._id == body.list_id){

      list.list.push({
        name:body.name,
        status:false,
        description:"",
        _id:Math.floor(Math.random() * 999999) + Math.floor(Math.random() * 999)
      });

      list_index = i;

    }

    return list;

  });

  new_board.list = found_list;
  req.user.boards[index] = new_board;

  var set_board = {$set:{boards:req.user.boards}} ;

  User.updateOne({_id:req.user._id},set_board).then((result)=>{
      console.log(result);
      res.json(result);
    }).catch((err)=>{
      next(err);
  });

}

const AddBoard = (req,res,next)=>{

  var board_heading = req.body;

  var config = {
    subtitle:"",
    name:board_heading.name,
    background:board_heading.background
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

module.exports.AddTaskList = AddTaskList;
module.exports.AddBoard = AddBoard;
module.exports.AddTaskToList = AddTaskToList;
module.exports.GetMyBoardPage = GetMyBoardPage;
