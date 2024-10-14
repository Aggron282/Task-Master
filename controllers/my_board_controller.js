const User = require("./../models/users.js");
const TaskList = require("./../data/task_class.js");
const Board = require("./../models/tasks.js");

const generateUniqueId = require('generate-unique-id');
const path = require("path");

const color_util = require("./../util/colors.js");
const board_util = require("./../util/board.js");

const ExtractColor = (req,res,next) => {

  const src = req.body.src;

  color_util.ExtractColors(req.body.src,(result)=>{
    res.json(result);
  })

}
const AddListToBoard = (req,res,next) => {

  const data = req.body;
  const query = req.params;

  var new_task_list = new TaskList(data,query);

  let chosen_board = null;

  User.findOne({username:req.user.username}).then((result)=>{

    if(!result){
      res.json(false);
      return;
    }

    var boards = [...result.boards];
    var updated_user = result;

    for(var i = 0; i < boards.length; i++){

      var no_space_name = boards[i].name.replace(/\s/g, '');

      if(no_space_name == new_task_list.board.name && new_task_list.board.id == boards[i]._id){

        chosen_board = boards[i];

        chosen_board.list = [...chosen_board.list, new_task_list];

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

const AddTaskToList = async (req,res,next) => {

  const body = req.body;
  const query = req.params;

  var boards = req.user.boards;

  var found_board = await board_util.FindBoardById(boards,query.board);
  var index = found_board.index;
  var board_data = found_board.board;

  if(!board_data){
    throw new Error("Could not find board");
  }

  var new_board = {...board_data};
  var list_index = 0;

  var found_list = board_data.list.map((list,i)=>{

    if(list._id == body.list_id){

        list.list.push({
          name:body.name,
          status:false,
          description:"",
          _id:generateUniqueId()
        });

        list_index = i;

      }

      return list;

  });

  new_board.list = found_list;
  console.log(found_list);
  req.user.boards[index] = new_board;

  var set_board = {$set:{boards:req.user.boards}} ;

  User.updateOne({_id:req.user._id},set_board).then((result)=>{
      res.json(result);
    }).catch((err)=>{
      console.log(err);
      next(err);
  });

}

const GetMyBoardPage = (req,res,next) => {
  res.sendFile(path.join(__dirname,"..","public","board.html"));
}

module.exports.ExtractColor = ExtractColor;
module.exports.AddTaskToList = AddTaskToList;
module.exports.AddListToBoard = AddListToBoard;
module.exports.GetMyBoardPage = GetMyBoardPage;
