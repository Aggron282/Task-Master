var board_modal_wrapper = document.querySelector(".board_wrapper");
var board_modal_container = document.querySelector(".board_modal_container");
var add_board_buttons = document.getElementsByClassName("add_task_button");
var new_board = document.querySelector("#new_board");
var colors = ["black","#bbbbbb","#a827cb","#e8a1c9","#1bd37e","#412d20","#bbbfde","#b871e9","#716c7f","#66f02d","#fb56aa","#c30230"]
var isModalRendered = false;
var active_color;

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
    <p class="title"> Choose Uploaded Background </p>
    <button class="upload_button">Upload Image</button>
    <br />
    <p class="title"> Choose Name of Board </p>
    <input class="board_input" id = "board_name" placeholder = "Name of Board">

    <button class="add_board_button showcase_button">Add Board</button>
  </div>`

  board_modal_wrapper.classList.add("wrapper_active");
  board_modal_container.innerHTML = html;

  AddColorBoxEvents();

  document.querySelector("#exit_modal").addEventListener("click",(e)=>{
    RemoveModal();
  });

  document.querySelector(".add_board_button").addEventListener("click",(e)=>{
    var name = document.querySelector("#board_name").value;
    CreateBoard(name,active_color);
  });

}

function RemoveModal(){

  isModalRendered = false;
  active_color = null;
  board_modal_container.innerHTML = "";
  board_modal_wrapper.classList.remove("wrapper_active");

}

function ReturnColorElements(){

  var html = ``;

  for(var i = 0; i < colors.length; i++){

    if(i < 1){
      html += `<div class="color_box color_active" style="background:${colors[i]}"></div>`
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
  board_modal_wrapper.style.background = active_color;

}

function AddColorBoxEvents(){

  var color_boxes = document.getElementsByClassName("color_box");

  for(var i =0; i < color_boxes.length; i++){

    color_boxes[i].addEventListener("click",(e)=>{

      var chosen_color = e.target.getAttribute("color");

      ChangeBoardColor(chosen_color);

      e.target.classList.add("color_active");

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
  console.log(name);
  if(name.length <= 0){
    RenderErrorBanner("Must Choose Name","orangered");
  }
  else{

    var board_heading = {
      name:name,
      background:background
    }

    axios.post("/board/create",board_heading).then((result)=>{
      console.log(result);
    }).catch((err)=>{
      alert("Error Occurred");
      console.log(err);
    })

  }

}

function Init(){

  if(add_board_buttons.length > 0){
    AddBoardButtonEvents();
  }

}


Init();
