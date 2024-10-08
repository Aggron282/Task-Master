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

function RenderBoardElements(board){

  var html = ``;
  var board_container = document.querySelector(".board_populate_container");

    for(var i = 0 ; i < board.length;i++){

      var no_space_name = board[i].name.replace(/\s/g, '');

      var background = board[i].background.filename ? `url('/images/${board[i].background.filename}')` : board[i].background;
      html += `
        <a href = "/my_board/id=:${board[i].id}/name=:${no_space_name}">
          <div class="taskboard" style = "background:${background}" id = "${board[i].id} name = "${board[i].name}">
            <div class = "inner_board">
              <p class="task_heading">${board[i].name}</p>
              <div class="see_more">...</div>
            </div>
          </div>
        </a>
      `
    }

    board_container.innerHTML = html;


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

function Init(){

  GetUser();

  if(add_board_buttons.length > 0){
    AddBoardButtonEvents();
  }

}


function GetUser(){

  axios.get("/user/data").then((result)=>{
    boards = result.data.boards;
    console.log(boards);
    RenderBoardElements(boards);
  });

}

Init();
