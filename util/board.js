async function FindBoardById(boards,id){

  for(var i =0; i < boards.length; i ++){

    if(id == boards[i]._id){
      return {board:boards[i],index:i};
    }

  }

  return null;

}


async function FindTaskInList(list,id){
  // console.log(list.list.list);
  for(var i =0; i < list.list.list.length; i ++){

    var task = list.list.list[i];

    if(id == task._id){
      return {task:task,index:i};
    }

  }

  return null;

}

async function FindListInBoard(board,id){
  for(var i =0; i < board.board.list.length; i ++){

    var list = board.board.list[i];

    if(id == list._id){
      return {list:list,index:i};
    }

  }

  return null;

}


module.exports.FindBoardById = FindBoardById;
module.exports.FindListInBoard = FindListInBoard;
module.exports.FindTaskInList = FindTaskInList;
