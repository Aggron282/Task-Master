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

const board_modal_wrapper = document.querySelector(".board_wrapper");
const board_modal_container = document.querySelector(".board_modal_container");
const add_board_buttons = document.getElementsByClassName("add_task_button");
const new_board = document.querySelector("#new_board");

const delete_boards = document.querySelector(".delete_boards");
const boards_found = document.getElementsByClassName("taskboard");

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

  chosen_color_input = document.querySelector(".chosen_color_input");
  board_modal_wrapper.classList.add("wrapper_active");

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
          Init();
        });

      })

   }

}

function BuildBoardHTML(board){

  var html = ``;

  var board_container = document.querySelector(".board_populate_container");

    for(var i = 0 ; i < board.length;i++){
      html += RenderTaskboard(board[i]);
    }

    board_container.innerHTML = html;

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

      chosen_color_input.value = chosen_color;
      console.log(chosen_color_input);

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
        BuildModalHTML();
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

    BuildBoardHTML(boards);

  });

}

Init();
