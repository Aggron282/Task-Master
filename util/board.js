async function FindBoardById(boards,id){

  for(var i =0; i < boards.length; i ++){

    if(id == boards[i]._id){
      return {board:boards[i],index:i};
    }

  }

  return null;

}


async function FindTaskInList(list,id){
  for(var i =0; i < list.length; i ++){

    var task = list[i];
    console.log(task._id , id);
    if(id == task._id){

      return {task:task,index:i};
    }

  }

  return null;

}

async function FindListInBoard(board,id){
  for(var i =0; i < board.list.length; i ++){

    var list = board.list[i];

    if(id == list._id){
      return {list:list,index:i};
    }

  }

  return null;

}

async function ChangeTask(board, list_id, task_id, new_task){

  var found_list = null;

  for(var i =0; i < board.list.length; i ++){

     if(board.list[i]._id == list_id){
       found_list = board.list[i];

       for(var k =0; i < found_list.length; k ++){
          if(task_id == found_list.list[k]._id){
            found_list.list[k] = new_task;
            console.log(new_task,found_list)
          }
       }

     }

  }

  return board;

}

module.exports.ChangeTask = ChangeTask;
module.exports.FindBoardById = FindBoardById;
module.exports.FindListInBoard = FindListInBoard;
module.exports.FindTaskInList = FindTaskInList;
