const colors = [
"#010101", // Original
 "#BBBBBB",
 "#C8C8C8",
 "#E8C9A1",
 "#1BD37E",
 "#412D20",
 "#BBBFDE",
 "#A71E94",
 "#716C7F",
 "#66D02F",
 "#FB56AA",
 "#C30230",
 "#00BFFF", // Extra
 "#FF7F50",
 "#7B68EE",
 "#00FA9A",
 "#FF6347",
 "#FFD700",
 "#6A5ACD",
 "#20B2AA",
 "#FF4500",
 "#DA70D6"
]

var board_modal_wrapper = document.querySelector(".board_wrapper");
var board_modal_container = document.querySelector(".board_modal_container");
var add_board_button = document.getElementsByClassName("add_task_button");
var new_board = document.querySelector("#new_board");

var delete_boards = document.querySelector(".delete_boards");
var boards_found = document.getElementsByClassName("taskboard");

var canDelete = false;
var isModalRendered = false;

var active_color;
var boards;
var chosen_color_input;
var chosen_image;

function BuildModalHTML(){

  isModalRendered = true;

  var html = RenderModalElement(colors);

  board_modal_container.innerHTML = html;

  board_modal_wrapper = document.querySelector(".board_wrapper");
  board_modal_container = document.querySelector(".board_modal_container");

  board_modal_wrapper.classList.add("wrapper_active");
  chosen_color_input = document.querySelector(".chosen_color_input");
  chosen_color_input.addEventListener("change",(e)=>{
    ChangeBoardColor(chosen_color_input.value);
  })

  AddColorBoxEvents();

  document.querySelector("#exit_modal").addEventListener("click",(e)=>{
    RemoveModal();
  });

  document.querySelector(".add_board_button").addEventListener("click",(e)=>{

    var name = document.querySelector("#board_name").value;
    var form = document.querySelector("#createboard");

    // form.preventDefault();
    e.preventDefault();

    CreateBoard(name,active_color);

  });

}

function RemoveModal(){

  isModalRendered = false;
  active_color = null;

  board_modal_container.innerHTML = "";

  board_modal_wrapper.classList.remove("wrapper_active");

}

function AddDeleteEvents(){

  var delete_button_ = document.getElementsByClassName("delete_button_");

  for(var i =0; i < delete_button_.length; i++){

      delete_button_[i].addEventListener("click",(e)=>{

        var _id = e.target.getAttribute("board_id");
        var ownerID = e.target.getAttribute("ownerID");
        var board = document.querySelector(`.taskboard[board_id="${_id}"]`);
        console.log(board)
        board.classList.add("out");
        var config = {
          _id:_id,
          ownerID:ownerID
        }

        axios.post("/my_board/delete/one",config).then((response)=>{
          InitDashboard();
        });

      })

   }

}

function RenderDashboardLoader(){
  var html = ``;

  var board_container = document.querySelector(".board_populate_container");
  board_container.innerHTML = "";
    for(var i = 0 ; i < 40;i++){


      html += ReturnBoardLoader();

    }

    board_container.innerHTML = html;
}

function BuildBoardHTML(board){

  if(!board){
    RenderDashboardLoader();
    return;
  }

  var html = ``;

  var board_container = document.querySelector(".board_populate_container");
  board_container.innerHTML = "";
    for(var i = 0 ; i < board.length;i++){
      console.log(board)
      if(!board[i].isArchived){
        html += RenderTaskboard(board[i]);
      }
    }

    board_container.innerHTML = html;

    add_board_buttons = document.getElementsByClassName("add_task_button");
    new_board = document.querySelector("#new_board");
    delete_boards = document.querySelector(".delete_boards");
    boards_found = document.getElementsByClassName("taskboard");
    chosen_color_input = document.querySelector(".chosen_color_input");

    AddDeleteEvents();

}

function ChangeBoardColor(color){

  var color_boxes = document.getElementsByClassName("color_box");

  for(var i =0; i < color_boxes.length; i++){
    color_boxes[i].classList.remove("color_active");
  }

  active_color = color;

  if(document.querySelector(".chosen_color_input")){

    var chosen_color_input = document.querySelector(".chosen_color_input");

    chosen_color_input.setAttribute("value",color)

  }

  board_modal_wrapper.style.background = active_color;

}

function AddColorBoxEvents(){

  var color_boxes = document.getElementsByClassName("color_box");

  for(var i =0; i < color_boxes.length; i++){

    color_boxes[i].addEventListener("click",(e)=>{

      var chosen_color = e.target.getAttribute("color");

      ChangeBoardColor(chosen_color);

      e.target.classList.add("color_active");

      if(chosen_color_input){
        chosen_color_input.setAttribute("value",chosen_color);
      }

      chosen_color_input.value = chosen_color;
      console.log(chosen_color_input);

    });

  }

}

function RenderNoBoardsFound() {
  const holder = document.querySelector(".board_populate_container");
  holder.innerHTML = `
    <div class="no-boards-container">
      <div class="no-boards-icon">😞</div>
      <h1 class="no-boards-heading">No Boards Found</h1>
      <p class="no-boards-subtext">Try searching with a different name or create a new board.</p>
    </div>
  `;
}

function AddBoardButtonEvents(){


    var new_board = document.querySelector("#new_board");
    var delete_boards = document.querySelector(".delete_boards");

    new_board.addEventListener("click",(e)=>{
      console.log("s")
      if(!isModalRendered){
        BuildModalHTML();
      }

    });

    delete_boards.addEventListener("click",(e)=>{

        canDelete = !canDelete;

        for(var i =0; i < boards_found.length; i++){

            if(canDelete){
              boards_found[i].classList.add("taskboard--delete")
            }
            else{
              boards_found[i].classList.remove("taskboard--delete")
            }

         }

    });

  }



function CreateBoard(name,background){

  if(name.length <= 0){
    RenderErrorBanner("Must Choose Name","orangered");
  }

  else if(document.querySelector("#createboard")){

    var form = document.querySelector("#createboard");

    const formData = new FormData(form);

    axios.post("/board/create", formData)
    .then(response => {
      RemoveModal();
      InitDashboard();
    })
    .catch(error => {
      console.error("Error creating board:", error);
    });
  }

}



function InitDashboard(){

  var time = setTimeout(()=>{BuildBoardHTML(null)},2000);

  axios.get("/user/data").then((result)=>{
    clearTimeout(time);
    time = null;
    boards = result.data.boards;

    BuildBoardHTML(boards);

    AddBoardButtonEvents();


  });

}
