async function FindBoardById(boards,id){

  for(var i =0; i < boards.length; i ++){

    if(id == boards[i]._id){
      return {board:boards[i],index:i};
    }

  }

  return null;

}

module.exports.FindBoardById = FindBoardById;
