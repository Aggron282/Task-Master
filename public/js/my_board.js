const board_container = document.querySelector(".my_taskboard_container");
const inner_container = document.querySelector(".inner_container_task");
const task_heading_container = document.querySelector(".task_heading_container");
// const overlay = document.querySelector(".overlay--board");

const url = window.location.href;
const name = url.split("name=:")[1];
let id = url.split("id=:")[1];

var chosen_board;

var isEditingTask = false;
var isEditing = false;
var didSetColors = false;

const ExitOutOfListModals = () => {

  var modals = document.getElementsByClassName("add_list_modal");

  for(var i = 0; i < modals.length; i++ ){
    modals[i].innerHTML = "";
  }

}

const ExitOutOfTaskModals = () => {

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

    var document_board = document.querySelector(".overlay--board");
    document_board.addEventListener("click",(e)=>{
      console.log(e.target);
      if(e.target.classList.contains("create_list_inner_modal") == false){
        add_list_modal.innerHTML = "";
      }
    })

    create_button.addEventListener("click",(e)=>{
      AddListToBoard(e,(result)=>{console.log(result)});
    });

  });

}

// const AddEventsToAddTask = (element) => {
//
//   var task_list = document.getElementsByClassName("task_list");
//   var add_list_modal = element.querySelector(".add_additional_list_modal");
//   var create_button =  add_list_modal.querySelector("#addTask");
//
//   for(var i =0; i < task_list.length; i++){
//
//     task_list[i].addEventListener("click",(e)=>{
//
//       var element = e.target;
//
//       isEditing = true;
//
//       if(!element.classList.contains("task_list")){
//         element = e.target.parentElement;
//       }
//       if(element.parentElement.classList.contains("create_list")){
//         return;
//       }
//
//       if(add_list_modal){
//
//         var list_id = element.getAttribute("_id");
//
//         add_list_modal.innerHTML = RenderAddTaskModal(list_id);
//
//         create_button.addEventListener("click",(e)=>{
//
//           if(isEditing){
//             AddTaskToBoard(e);
//           }
//
//         });
//
//       }
//
//     })
//
//   }
//
// }

const AddListToBoard = (e,cb) => {

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

  axios.post(`/my_board/id=${id}/name=${name}/list/add`,config).then((result)=>{
    InitMyBoard();
    cb(result);
  }).catch(err => console.log(err));

}


const SetCurrentBoard = async () => {

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

const AddEventsToAddTask = () => {

  var add_task_to_list_buttons = document.getElementsByClassName("add_additional_list_modal");

  for(var i =0; i < add_task_to_list_buttons.length; i++){

        add_task_to_list_buttons[i].addEventListener("click",(e)=>{
            if(e.target.getAttribute("isEditing") == 1){
              return;
            }
            for(var x = 0; x < add_task_to_list_buttons.length; x++){
              if(add_task_to_list_buttons[x].getAttribute("isEditing") == 1){
                var parent = add_task_to_list_buttons[x].parentElement;
                var modal_container= parent.querySelector(".create_task_to_board_modal");
                add_task_to_list_buttons[x].setAttribute("isEditing",0)
                modal_container.innerHTML = "";

              }
            }
          if(e.target.getAttribute("isEditing") == 0){
            AddTaskToDBEvent(e);
          }
        })

  }

}

const AddTaskToDBEvent = (e) => {

  var parent = e.target.parentElement
  var _id = parent.getAttribute("_id");
  var modal_container = parent.querySelector(".create_task_to_board_modal");
  modal_container.innerHTML = RenderAddTaskModal(_id);

  e.target.setAttribute("isEditing",1);
  console.log(e.target);
  var add_task_button_to_db = modal_container.parentElement.querySelector(".add_additional_list_modal");

  add_task_button_to_db.addEventListener("click", async (e)=>{
    var parent = e.target.parentElement;
    if(e.target.getAttribute("isEditing") == 0 && isEditingTask){
      return;
    }
    var task_input = parent.querySelector(".add_task_to_list_input");
    console.log(task_input.value);
    isEditingTask = true;

    if(task_input.value.length < 1){
      alert("Task is Empty");
    }
    else{

      isEditingTask = false;
      var _id = parent.getAttribute("_id");
      console.log(_id,task_input.value);
      await axios.post(`/my_board/id=${id}/name=${name}/task/add`,{list_id:_id, name: task_input.value});
      InitMyBoard();
    }

  });

}

const InitMyBoard = async () => {

   isEditing = false;
   isEditingTask = false;

   await SetCurrentBoard();

   if(!didSetColors){
     SetDynamicColors(chosen_board);
     didSetColors = true;
   }

   ExitOutOfListModals();
   ExitOutOfTaskModals();

   BuildListHTML(chosen_board);

   AddEventToAddList();
   AddEventsToAddTask();
   EnableDragDrop();
}

const BuildListHTML = async (board) =>{
  var html = RenderList(board);
  inner_container.innerHTML =  html;
}

const SetDynamicColors = async (chosen_board) => {

  var task_heading = document.querySelector(".task_heading");
  var side_nav = document.querySelector(".task_sidenav");

  var background = chosen_board.background;
  var rgb = chosen_board.background;
  var color_data = chosen_board.background;
  var linear_grad = `linear-gradient(to bottom`;

  document.body.style.background = background;

  if(chosen_board.background_img){
   background = chosen_board.background_img ? `url("/images/${chosen_board.background_img.filename}")` : chosen_board.background;
   rgb = chosen_board.background_img ?  chosen_board.background_img.filename : chosen_board.background;
   color_data = await axios.post("/api/color/all",{src:rgb});
   document.body.style.background = background;
  }
  else{

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

    var side_color = [...current_background];

    if(parseInt(sub_color.color) > 30){
      current_background[sub_color.index] = Math.floor(sub_color.color / 2.5);
    }
    else{
      current_background[dom_color.index] = Math.floor(dom_color.color / 1.2);
    }

    diff_color_style = `rgb(${current_background[0]},${current_background[1]},${current_background[2]})`;

    if(parseInt(sub_color.color) > 30){
      side_color[sub_color.index] =sub_color.color - 5;
    }
    else{
      side_color[dom_color.index] =dom_color.color - 15;
    }

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

}

InitMyBoard();
