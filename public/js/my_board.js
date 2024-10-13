const board_container = document.querySelector(".my_taskboard_container");
const inner_container = document.querySelector(".inner_container_task");
const task_heading_container = document.querySelector(".task_heading_container");
const overlay = document.querySelector(".overlay--board");

const url = window.location.href;
const name = url.split("name=:")[1];
let id = url.split("id=:")[1];

var chosen_board;

var isEditing = false;

function ExitOutOfListModals(){

  var modals = document.getElementsByClassName("add_list_modal");

  for(var i = 0; i < modals.length; i++ ){
    modals[i].innerHTML = "";
  }

}

function ExitOutOfTaskModals(){

  var modals = document.getElementsByClassName("add_additional_list_modal");

  for(var i = 0; i < modals.length; i++ ){
    modals[i].innerHTML = "+ Add Task";
  }

}

const AddEventToAddList = () => {

  var create_list = document.querySelector(".create_list");
  var add_list_modal = document.querySelector(".add_list_modal");

  create_list.addEventListener("click",(e)=>{

    ExitOutOfListModals();
    ExitOutOfTaskModals();

    isEditing = true;

    add_list_modal.innerHTML = RenderAddListModal();

    var create_button = document.querySelector("#addList");

    create_button.addEventListener("click",(e)=>{
      AddListToBoard(e,(result)=>{console.log(result)});
    });

  });

}

const AddEventsToAddTask = (element) => {

  var task_list = document.getElementsByClassName("task_list");
  var add_list_modal = element.querySelector(".add_additional_list_modal");
  var create_button =  add_list_modal.querySelector("#addTask");

  for(var i =0; i < task_list.length; i++){

    task_list[i].addEventListener("click",(e)=>{

      var element = e.target;

      isEditing = true;

      if(!element.classList.contains("task_list")){
        element = e.target.parentElement;
      }
      if(element.parentElement.classList.contains("create_list")){
        return;
      }


      if(add_list_modal){

        var list_id = element.getAttribute("_id");

        add_list_modal.innerHTML = RenderAddTaskModal(list_id);

        create_button.addEventListener("click",(e)=>{

          if(isEditing){
            AddTaskToBoard(e);
          }

        });

      }

    })

  }

}

function AddListToBoard(e,cb){

  var modal = e.target.parentElement;
  var input = modal.querySelector("#listInput");

  if(input.length < 1){
    alert("Name of List too Short");
    return;
  }

  var config = {
    name:input.value,
    date_of_creation: new Date()
  }

  axios.post(`/my_board/create/id=${id}/name=${name}`,config).then((result)=>{
    InitMyBoard();
    cb(result);
  }).catch(err => console.log(err));

}

function AddTaskToBoard(e,cb){

  var modal = e.target.parentElement;
  var input = modal.querySelector("#taskInput");
  var list_id = modal.getAttribute("_id");

  if(input.value.length < 1){
    alert("Name of List too Short");
    return;
  }

  var config = {
    name:input.value,
    board_id:id,
    list_id:modal.getAttribute("_id")
  }

  if(isEditing){
    axios.post(`/my_board/add/task`,config).then((result)=>{
      InitMyBoard();
    }).catch(err => console.log(err));
  }

}

async function SetCurrentBoard(){

  id = id.split("/name=:")[0]

  var result = await axios.get("/user/data");

  if(!result){

    console.log("No Data Found");

    window.location.assign("/user/login");

    return;

  }

  var user = result.data;

  for(var i = 0; i < user.boards.length; i++){

    var no_space_name = user.boards[i].name.replace(/\s/g, '');

    if(no_space_name == name && id == user.boards[i]._id){
      chosen_board = user.boards[i];
    }

  }

}

async function InitMyBoard (){

   isEditing = false;

   await SetCurrentBoard();

   var background = chosen_board.background;
   var rgb = chosen_board.background;
   var color_data = chosen_board.background;
   var task_heading = document.querySelector(".task_heading");
   var side_nav = document.querySelector("#sidebackground");
   var linear_grad = `linear-gradient(to bottom`;

   task_heading.style.background = background;

   if(chosen_board.background_img){
    background = chosen_board.background_img ? `url("/images/${chosen_board.background_img.filename}")` : chosen_board.background;
    rgb = chosen_board.background_img ?  chosen_board.background_img.filename : chosen_board.background;
    color_data = await axios.post("/api/color/all",{src:rgb});
  }else{

   var side_nav_background = null;
   var current_background = background;

   current_background = background.split(",");
   current_background[0] = current_background[0].substr(4);
   current_background[2] = current_background[2].replace(")","")

   var dom_color = {
     color:parseInt(current_background[0]),
     index:0
   }

   var sub_color = {
     color:parseInt(current_background[2]),
     index:2
   }

   for(var r = 0; r < current_background.length; r++){

      if(parseInt(current_background[r]) > dom_color.color){
        dom_color.color = current_background[r];
        dom_color.index = r;
      }
      if(parseInt(current_background[r]) < sub_color.color){
        sub_color.color = current_background[r];
        sub_color.index = r;
      }

   }

   console.log(dom_color);
   console.log(sub_color);
   var side_color = [...current_background];
   if(parseInt(sub_color.color) > 30){
     current_background[sub_color.index] = Math.floor(sub_color.color / 2.5);
   }else{
     current_background[dom_color.index] = Math.floor(dom_color.color / 1.2);
   }

   diff_color_style = `rgb(${current_background[0]},${current_background[1]},${current_background[2]})`;

   if(parseInt(sub_color.color) > 30){
     side_color[sub_color.index] =sub_color.color - 5;
   }else{
     side_color[dom_color.index] =dom_color.color - 15;
   }


   console.log(current_background);
   side_color_style = `rgb(${side_color[0]},${side_color[1]},${side_color[2]})`;

   side_nav.style.background = side_color_style;
   side_nav.style.borderRight = `1px solid ${diff_color_style}`;
   task_heading.style.background = diff_color_style;
 }
   if(color_data.data){

     for (var i =0; i < color_data.data.length - 3; i++){

       var chosen_color = color_data.data[i];

       linear_grad += `,rgba(${chosen_color.r},${chosen_color.g},${chosen_color.b},${1})`;

     }

     linear_grad+= ")";

     task_heading.style.background = linear_grad;
     side_nav.style.background = linear_grad;

   }

   overlay.style.background = background;

   ExitOutOfListModals();
   ExitOutOfTaskModals();

   BuildListHTML(chosen_board);

   AddEventToAddList();

}

async function BuildListHTML(board){
  var html = RenderList(board);
  inner_container.innerHTML =  html;
}

InitMyBoard();
