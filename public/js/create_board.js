var board_modal_wrapper = document.querySelector(".board_wrapper");
var board_modal_container = document.querySelector(".board_modal_container");
var add_board_buttons = document.getElementsByClassName("add_task_button");
var new_board = document.querySelector("#new_board");
var colors = ["black","#bbbbbb","#a827cb","#e8a1c9","#1bd37e","#412d20","#bbbfde","#b871e9","#716c7f","#66f02d","#fb56aa","#c30230"]
var isModalRendered = false;
var active_color;
var boards;
var chosen_color_input;
var chosen_image;
var delete_boards = document.querySelector(".delete_boards");
var canDelete = false;

var boards_found = document.getElementsByClassName("taskboard");


function RenderModal(){

  isModalRendered = true;

  var html = `

  <div class="modal_board">

    <div class="error_banner"></div>

    <p id="exit_modal"> X </p>

    <p class="title"> Choose Background </p>

    ${ReturnColorElements()}

    <br />
    <br />

    <form method = "POST" action = "/board/create" id="createboard"  enctype = "multipart/form-data">
    <input class="chosen_color_input" name='${colors[0]}' type="hidden"/>

      <p class="title"> Choose Uploaded Background </p>

      <input type='file' class=" upload_button" name="thumbnail"  placeholder="Image URL">

      <br />

      <p class="title"> Choose Name of Board </p>

      <input class="board_input" id = "board_name" name="name" placeholder = "Name of Board">

      <button class="add_board_button showcase_button" type = "submit"> Add Board </button>

    </form>

  `;

  board_modal_wrapper.classList.add("wrapper_active");
  chosen_color_input = document.querySelector(".chosen_color_input");
  board_modal_container.innerHTML = html;

  AddColorBoxEvents();

  document.querySelector("#exit_modal").addEventListener("click",(e)=>{
    RemoveModal();
  });

  document.querySelector(".add_board_button").addEventListener("click",(e)=>{
    var name = document.querySelector("#board_name").value;
    var form = document.querySelector("#createboard");
    form.preventDefault();
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

  var delete_buttons_found = document.getElementsByClassName(".delete_button_");

  for(var t =0; t < boards_found.length;i++){

    delete_buttons_found[i].addEventListener("click",(e)=>{

      var id = e.target.getAttribute("id");
      var owner_id = e.target.getAttribute("ownerID");
      console.log(id,owner_id);
    });

  }

}

function RenderBoardElements(board){

  var html = ``;
  var board_container = document.querySelector(".board_populate_container");

    for(var i = 0 ; i < board.length;i++){

      var no_space_name = board[i].name.replace(/\s/g, '');

      var background = board[i].background_img ? `url('/images/${board[i].background_img.filename}')` : board[i].background;
      html += `
          <div class="taskboard" style = "background:${background}" id = "${board[i]._id} name = "${board[i].name}">
            <a href = "/my_board/id=:${board[i]._id}/name=:${no_space_name}">
            <div class = "inner_board">
              <p class="task_heading">${board[i].name}</p>

            </div>
            </a>
            <div class="delete_button_" ownerID = "${board[i].ownerID}" id = "${board[i]._id}">X </div>
          </div>

      `
    }

    board_container.innerHTML = html;

    var delete_button_ = document.getElementsByClassName("delete_button_");

    for(var i =0; i < delete_button_.length; i++){
        delete_button_[i].addEventListener("click",(e)=>{
          var _id = e.target.getAttribute("id");
          var ownerID = e.target.getAttribute("ownerID");
          var config = {
            _id:_id,
            ownerID:ownerID
          }
          axios.post("/my_board/delete/one",config).then((response)=>{
            console.log(response);
            Init();

          });

        })
    }

}

function ReturnColorElements(){

  var html = ``;

  for(var i = 0; i < colors.length; i++){

    if(i < 1){
      html += `<div class="color_box color_active" style="background:${colors[i]}">

      </div>`
      active_color = colors[i];
    }
    else{
      html += `<div class="color_box "  color = "${colors[i]}" style="background:${colors[i]}"></div>`
    }

  }

  board_modal_wrapper.style.background = active_color;

  return html;

}

function ChangeBoardColor(color){

  var color_boxes = document.getElementsByClassName("color_box");

  for(var i =0; i < color_boxes.length; i++){
    color_boxes[i].classList.remove("color_active");
  }

  active_color = color;


  if(document.querySelector(".chosen_color_input")){
    var chosen_color_input = document.querySelector(".chosen_color_input");
    chosen_color_input.setAttribute("name",color)
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
        chosen_color_input.setAttribute("name",chosen_color);
      }

    });

  }

}

function AddBoardButtonEvents(){

  for(var i =0; add_board_buttons.length; i++){

    if(!add_board_buttons[i]){
      break;
    }

    add_board_buttons[i].addEventListener("click",(e)=>{

      if(!isModalRendered){
        RenderModal();
      }

    })

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

}

function CreateBoard(name,background){

  if(name.length <= 0){
    RenderErrorBanner("Must Choose Name","orangered");
  }

  else if(document.querySelector("#createboard")){
    var form = document.querySelector("#createboard");
    form.submit();
  }

}


if(add_board_buttons.length > 0){
  AddBoardButtonEvents();
}

function Init(){

  axios.get("/user/data").then((result)=>{
    boards = result.data.boards;
    console.log(boards);
    RenderBoardElements(boards);
  });

}

Init();
