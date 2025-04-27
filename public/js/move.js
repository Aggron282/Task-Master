function InitMoveFeature(){

  axios.get("/api/user").then(async ({data})=>{

    var {profilePicture} = data.profile;
    var navbar_wrapper = document.querySelector(".navbar-wrapper");

    navbar_wrapper.innerHTML = ReturnNavbarBoard(data.profile.username);

    var container = document.querySelector(".profile-holder");
    var wrapper = document.querySelector(".db");

    InitProfile(container,wrapper);

    var profile_holder = document.querySelectorAll(".profile-img-wrapper");
    var move_holder = document.querySelector(".move-canopy");

    let id = url.split("id=:")[1];

    id = id.split("/")[0]

    var {data} = await axios.get(`/api/board/current/${id}`);
    var response = await axios.get(`/api/board/all/`);

    var board = data.board;
    var all_boards = response.data.boards;

    move_holder.innerHTML += ReturnMoveToBoardModal(all_boards);
    // move_holder.innerHTML += ReturnMoveToListModal(board);

    var exit_move_modal = document.querySelector(".exit--board--modal");
    var action_list_move_board = document.querySelectorAll(".list-action--move");
    var action_list_copy_board = document.querySelectorAll(".list-action--copy");

    function ToggleAndSetModalToMoveBoard(e,set){
      var parent = e.target.parentElement;
      const moveWrapper = document.querySelector(".move-board-wrapper");

      moveWrapper.setAttribute("data-type",set);
      moveWrapper.setAttribute("list_id",parent.getAttribute("list_id"));

      if (moveWrapper) moveWrapper.classList.toggle("hidden");
    }


    for(var i =0; i <action_list_move_board.length;i++){

      action_list_move_board[i].addEventListener("click",(e)=>{
        ToggleAndSetModalToMoveBoard(e,0);
      });

    }

    for(var i =0; i <action_list_copy_board.length;i++){

      action_list_copy_board[i].addEventListener("click",(e)=>{
        ToggleAndSetModalToMoveBoard(e,1);
      });

  }

    exit_move_modal.addEventListener("click", function(e) {
        const moveWrapper = document.querySelector(".move-board-wrapper");
        if (moveWrapper) moveWrapper.classList.toggle("hidden");
    });

    var board_items_in_move_modal = document.querySelectorAll(".board-move-item");

    for(var i =0; i < board_items_in_move_modal.length; i++){

      var board_item = board_items_in_move_modal[i];

      board_item.addEventListener("click",async (e)=>{
          var board_id = e.target.getAttribute("board_id");
          var current_board_id = id;

          const moveWrapper = document.querySelector(".move-board-wrapper");

          var list_id = moveWrapper.getAttribute("list_id");

          var data;

          var isMove = moveWrapper.getAttribute("data-type") == 0 ? true : false;

          if(isMove){
            data = await  axios.post("/api/move/list",{list_id:list_id,current_board_id:current_board_id,board_id:board_id});
          }else{
            data = await  axios.post("/api/copy/list",{list_id:list_id,current_board_id:current_board_id,board_id:board_id});
          }

        });

    }
      // for(var i =0; i <profile_holder.length;i++){
      //   PopulateProfileImg(profile_holder[i],profilePicture,data.profile.username);
      // }


  // document.addEventListener("click", function(e) {
  //
  //   if (e.target.classList.contains("exit--list--modal")) {
  //
  //     const moveWrapper = document.querySelector(".list-wrapper");
  //
  //     if (moveWrapper) moveWrapper.classList.toggle("hidden");
  //
  //   }
  //
  // });


  });
}

InitMoveFeature();
