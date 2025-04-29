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

const GetCurrentBoard = async (req,res) => {

  var boards = req.user.boards;
  // console.log(req.params)
  var found_board = await board_util.FindBoardById(boards,req.params.id);
  // console.log(found_board);
  res.json({board:found_board.board});

}


const GetAllBoards =  (req,res) => {

  var boards = req.user.boards;
  // console.log(boards);
  res.json({boards:boards});

}

const MoveListToAnotherBoard = async (req, res) => {

  const { list_id, current_board_id, board_id } = req.body;
  // console.log("S")
  let found_current_board = await board_util.FindBoardById(req.user.boards, current_board_id);
  let found_new_board = await board_util.FindBoardById(req.user.boards, board_id);
  // console.log(found_new_board,board_id)
  var current_board_index = found_current_board.index;
  var new_board_index = found_new_board.index;

  found_current_board = found_current_board.board;
  found_new_board = found_new_board.board;

  var found_list = await board_util.FindTaskInList(found_current_board.list, list_id);
  found_list = found_list.task;
  found_current_board.list = found_current_board.list.filter(item => item._id !== list_id);

  found_new_board.list.push(found_list);

  req.user.boards[current_board_index] = found_current_board;
  req.user.boards[new_board_index] = found_new_board;

  var set_board = {$set:{boards:req.user.boards}} ;

  User.updateOne({_id:req.user._id},set_board).then((result)=>{
      res.json({ error: null, board: found_current_board, new_board: found_new_board });
    }).catch((err)=>{
        console.log(err);
        next(err);
    });

};

const CopyListToAnotherBoard = async (req,res) => {

  const { list_id, current_board_id, board_id } = req.body;
  // console.log(list_id,current_board_id,board_id);
   let found_current_board = await board_util.FindBoardById(req.user.boards, current_board_id);
   let found_new_board = await board_util.FindBoardById(req.user.boards, board_id);

   // console.log(found_current_board,found_new_board)

   var current_board_index = found_current_board.index;
   var new_board_index = found_new_board.index;

   found_current_board = found_current_board.board;
   found_new_board = found_new_board.board;

   var  found_list = await board_util.FindTaskInList(found_current_board.list, list_id);
   found_list = found_list.task;
   var cloned_list = JSON.parse(JSON.stringify(found_list));

   found_new_board.list.push(cloned_list);

   req.user.boards[new_board_index] = found_new_board;

   var set_board = {$set:{boards:req.user.boards}} ;

   User.updateOne({_id:req.user._id},set_board).then((result)=>{

     res.json({ error: null, board: found_current_board, new_board: found_new_board });

     }).catch((err)=>{
         console.log(err);
         next(err);
     });

}

const DeleteOneFile = async (req, res, next) => {
  try {
    const { list_id, task_id, board_id, attachment_id } = req.body;

    var found_board = await board_util.FindBoardById(req.user.boards, board_id);
    if (!found_board) {
      throw new Error("Could not find board");
    }
    var board_index = found_board.index;
    found_board = found_board.board;

    var found_list = await board_util.FindListInBoard(found_board, list_id);
    if (!found_list) {
      throw new Error("Could not find list");
    }

    var found_task = await board_util.FindTaskInList(found_list.list.list, task_id);
    if (!found_task) {
      throw new Error("Could not find task");
    }

    // Delete the attachment
    found_task.task.attachments = found_task.task.attachments.filter(att => att._id !== attachment_id);

    // Update the task in the list
    found_list.list.list = found_list.list.list.map(task => {
      if (task._id === found_task.task._id) {
        return found_task.task;
      } else {
        return task;
      }
    });

    // Update the list in the board
    found_board.list = found_board.list.map(list => {
      if (list._id === found_list.list._id) {
        return found_list.list;
      } else {
        return list;
      }
    });

    // Update the user's boards
    req.user.boards[board_index] = found_board;
    var set_board = { $set: { boards: req.user.boards } };

    await User.updateOne({ _id: req.user._id }, set_board);

    res.json({ error: null, message: "Attachment deleted successfully", attachment_id });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const AttachFile = async (req,res,next) => {
  var {list_id, task_id, board_id} = req.body;
  // var {attachment} = req.body.attachment;
  var found_board = await board_util.FindBoardById(req.user.boards,board_id);
  var index = found_board.index;

  if(!found_board){
    throw new Error("Could not find board");
  }

  var found_list = await board_util.FindListInBoard(found_board.board,list_id);
  var found_task = await board_util.FindTaskInList(found_list.list.list, task_id);

  var user = req.user;
  var new_board = {...found_board.board};

  var file_data = {
    originalname:req.file.originalname,
    filename:req.file.filename,
    _id:generateUniqueId(),
    mimetype:req.file.mimetype
  }


  found_task.task.attachments = Array.isArray(found_task.task.attachments) ? found_task.task.attachments : [];

  found_task.task.attachments.push(file_data);

  found_list.list.list.map((task)=>{

    if(task._id == found_task.task._id){
      return found_task.task;
    }
    else{
      return task;
    }

  });


  new_board.list = new_board.list.map((list)=>{

      if(list._id == found_list.list._id){
        return found_list.list
      }
      else{
        return list;
      }

  });

  var set_board = {$set:{boards:req.user.boards}} ;

  SetNewBoard(req,new_board)
  // console.log(found_task)
  User.updateOne({_id:req.user._id},set_board).then((result)=>{
      res.json({error:null,attachment:file_data});
    }).catch((err)=>{
        console.log(err);
        next(err);
    });


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
          watched:null,
          deadline:"",
          attachments:[],
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

  var originalList = await board_util.FindListInBoard(found_board.board,list_id);
  var task_to_archive = await board_util.FindTaskInList(originalList.list.list, task_id);

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

  // console.log(new_board.list.list)

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


const LabelTask = async (req,res) => {

  var {list_id, task_id, board_id, label} = req.body;
  var found_board = await board_util.FindBoardById(req.user.boards,board_id);
  var index = found_board.index;

  if(!found_board){
    throw new Error("Could not find board");
  }

  var originalList = await board_util.FindListInBoard(found_board.board,list_id);
  var task_to_archive = await board_util.FindTaskInList(originalList.list.list, task_id);

  task_to_archive.task.label = label;

  originalList.list.list.map((list)=>{

    if(list._id == task_to_archive.task._id){
      return task_to_archive.task;
    }
    else{
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
  found_task.description =  form.description;
  found_task.deadline =form.date;
  found_task.watching = form.watching;
  // console.log(found_task)
  var new_board = await board_util.ChangeTask(found_board.board, list_id, task_id, found_task);
  var set_board = {$set:{boards:new_board}} ;

  User.updateOne({_id:req.user._id},set_board).then((result)=>{
    // console.log(new_board);
      res.json({result:result,board:new_board});
    }).catch((err)=>{
      console.log(err);
      next(err);
  });

}

module.exports.LabelTask = LabelTask;
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
module.exports.AttachFile = AttachFile;
module.exports.DeleteOneFile = DeleteOneFile;
module.exports.GetAllBoards = GetAllBoards;
module.exports.MoveListToAnotherBoard = MoveListToAnotherBoard;
module.exports.CopyListToAnotherBoard = CopyListToAnotherBoard
module.exports.GetCurrentBoard = GetCurrentBoard;
