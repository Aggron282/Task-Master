var board_container = document.querySelector(".my_taskboard_container");

var chosen_board;


function RenderList(){

  if(!chosen_board){
    return;
  }
  var html = ``;

  if(chosen_board.list <= 0){
    board_container.innerHTML =  `
    <div class="list_heading inactive_list">
      Add List
    </div>
    `
  }

}

async function  Init (){

   var url = window.location.href;
   var name = url.split("name=:")[1];
   var _id = url.split("id=:")[1];

   _id = _id.split("/name=:")[0]

   var result = await axios.get("/user/data");

   if(!result){
     return
   }

   var user = result.data;

     for(var i = 0; i < user.boards.length; i++){
       var no_space_name = user.boards[i].name.replace(/\s/g, '');

       if(no_space_name == name && _id == user.boards[i]._id){
         chosen_board = user.boards[i];
       }

     }


   board_container.style.background = chosen_board.background;

}


Init();
