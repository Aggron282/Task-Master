const User = require("./../models/users.js");
const TaskList = require("./../data/task_class.js");
const Board = require("./../models/tasks.js");

const generateUniqueId = require('generate-unique-id');
const path = require("path");

const color_util = require("./../util/colors.js");
const board_util = require("./../util/board.js");

const GetBoards = (req,res,next) => {

  var boards = req.user.boards;

  res.json({boards:boards});

}

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
  req.user.boards[index] = new_board;

  var set_board = {$set:{boards:req.user.boards}} ;

  User.updateOne({_id:req.user._id},set_board).then((result)=>{
      res.json(result);
    }).catch((err)=>{
      next(err);
  });

}

const GetMyBoardPage = (req,res,next) => {
  res.sendFile(path.join(__dirname,"..","public","board.html"));
}

const ChangeTasks = async (req,res) => {


  var {list_id, newListId, task_id, board_id} = req.body;
  var found_board = await board_util.FindBoardById(req.user.boards,board_id);

  var index = found_board.index;

  if(!found_board){
    throw new Error("Could not find board");
  }

  var originalList = await board_util.FindListInBoard(found_board.board,list_id);
  var newList = await board_util.FindListInBoard(found_board.list,newListId);
  var task_to_replace = await board_util.FindTaskInList(originalList.list, task_id);

  const listWithRemovedTask = originalList.list.list.filter(task => {
    return task._id != task_to_replace.task._id;
  });

  const listWithAddedTask = newList.list.list.push(task_to_replace.task);

  var new_board = {...found_board.board};

  new_board.list = new_board.list.map((list)=>{

        if(list._id == originalList.list._id){
          originalList.list.list = listWithRemovedTask.list ? listWithRemovedTask.list : [] ;
          return originalList.list
        }
        else{
          return list;
       }

  });

  new_board.list = new_board.list.map((list)=>{

      if(list._id === newList._id){
        newList.list.list = listWithAddedTask.list ? listWithAddedTask.list : [] ;
        return newList.list
      }
      else{
        return list;
      }

  });

  req.user.boards[index] = new_board;

  var set_board = {$set:{boards:req.user.boards}} ;

  User.updateOne({_id:req.user._id},set_board).then((result)=>{
      res.json(result);
    }).catch((err)=>{
      console.log(err);
      next(err);
  });

}

const ArchiveTask = async (req,res) => {

  var {list_id, task_id, board_id} = req.body;
  var found_board = await board_util.FindBoardById(req.user.boards,board_id);
  var index = found_board.index;

  if(!found_board){
    throw new Error("Could not find board");
  }

  console.log(found_board);
  var originalList = await board_util.FindListInBoard(found_board.board,list_id);
  var task_to_archive = await board_util.FindTaskInList(originalList.list.list, task_id);
  console.log(originalList.list,task_to_archive);
  task_to_archive.task.isArchived = true;

  originalList.list.list.map((list)=>{

    if(list._id == task_to_archive.task._id){
      return task_to_archive.task;
    }else{
      return list;
    }

  });

  var new_board = {...found_board.board};

  new_board.list = new_board.list.map((list)=>{

        if(list._id == originalList.list._id){
          return originalList.list
        }
        else{
          return list;
       }

  });

  var set_board = {$set:{boards:req.user.boards}} ;
  SetNewBoard(req,new_board)

  User.updateOne({_id:req.user._id},set_board).then((result)=>{
        res.json(result);
      }).catch((err)=>{
        console.log(err);
        next(err);
    });

}

const WatchTask = async (req,res) => {

  var {list_id, task_id, board_id} = req.body;
  var found_board = await board_util.FindBoardById(req.user.boards,board_id);
  var index = found_board.index;

  if(!found_board){
    throw new Error("Could not find board");
  }

  var originalList = await board_util.FindListInBoard(found_board.board,list_id);
  var task_to_archive = await board_util.FindTaskInList(originalList.list.list, task_id);

  task_to_archive.task.isWatched = !task_to_archive.task.isWatched;

  originalList.list.list.map((list)=>{

    if(list._id == task_to_archive.task._id){
      return task_to_archive.task;
    }
    else{
      return list;
    }

  });
  var new_board = {...found_board.board};
  console.log(new_board.list.list)
  new_board.list = new_board.list.map((list)=>{

        if(list._id == originalList.list._id){
          return originalList.list
        }
        else{
          return list;
       }

  });

  var set_board = {$set:{boards:req.user.boards}} ;

  SetNewBoard(req,new_board)

  User.updateOne({_id:req.user._id},set_board).then((result)=>{
        res.json(result);
      }).catch((err)=>{
        console.log(err);
        next(err);
    });

}


function SetNewBoard(req,board){
  var new_boards = {...req.user.boards};

  for(var i =0; i < new_boards.length;i++){

    if(new_boards[i].id == board.id ){
      new_boards[i] =  board;
    }

  }

  req.user.boards = new_boards;

}


const DeleteTask = async (req, res) => {
    try {
        const { list_id, taskId, board_id } = req.body;
        const task_id = taskId;

        // Find the board
        const found_board = await board_util.FindBoardById(req.user.boards, board_id);
        if (!found_board) throw new Error("Could not find board");

        const boardIndex = found_board.index;
        let boardData = found_board.board;

        // Find the list
        const originalList = await board_util.FindListInBoard(boardData, list_id);
        if (!originalList) throw new Error("Could not find list");

        // Remove task from list
        originalList.list.list = originalList.list.list.filter(task => task._id !== task_id);

        // Update the board with the new list
        const updatedBoard = { ...boardData };
        updatedBoard.list = updatedBoard.list.map(list =>
            list._id === originalList.list._id ? originalList.list : list
        );

        req.user.boards[boardIndex] = updatedBoard;

        // Update in database
        await User.updateOne({ _id: req.user._id }, { $set: { boards: req.user.boards } });

        res.json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const GetTaskData = async (req,res) => {

  var {board_id, list_id, task_id} = req.params
  console.log(req.params)
  var found_board= await board_util.FindBoardById(req.user.boards,board_id);
  var found_list = await board_util.FindListInBoard(found_board.board, list_id);
  var found_task = await board_util.FindTaskInList(found_list.list.list, task_id);
  res.json({task:found_task});

}

const ChangeTask = async (req,res) => {

  var {board_id, list_id, task_id, form} = req.body;

  var found_board= await board_util.FindBoardById(req.user.boards,board_id);
  var found_list = await board_util.FindListInBoard(found_board.board, list_id);
  var found_task = await board_util.FindTaskInList(found_list.list.list, task_id);

  found_task = found_task.task;
  found_task.name = form.name;
  found_task.description = form.description;

  var new_board = await board_util.ChangeTask(found_board.board, list_id, task_id, found_task);

  var set_board = {$set:{boards:new_board}} ;

  User.updateOne({_id:req.user._id},set_board).then((result)=>{
      res.json(result);
    }).catch((err)=>{
      console.log(err);
      next(err);
  });

}

module.exports.WatchTask = WatchTask;
module.exports.ChangeTask = ChangeTask;
module.exports.ArchiveTask = ArchiveTask;
module.exports.GetTaskData = GetTaskData;
module.exports.DeleteTask = DeleteTask;
module.exports.ChangeTasks   = ChangeTasks;
module.exports.ExtractColor = ExtractColor;
module.exports.AddTaskToList = AddTaskToList;
module.exports.AddListToBoard = AddListToBoard;
module.exports.GetMyBoardPage = GetMyBoardPage;
module.exports.GetBoards = GetBoards;
