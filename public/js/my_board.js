var board_container = document.querySelector(".my_taskboard_container");
var inner_container = document.querySelector(".inner_container_task");
var task_heading_container = document.querySelector(".task_heading_container");
var overlay = document.querySelector(".overlay--board");

var url = window.location.href;
var name = url.split("name=:")[1];
var id = url.split("id=:")[1];

var chosen_board;

var isEditing = false;

const RenderListItem = (task_list) => {

  var list_of_tasks = RenderTaskItems(task_list.list);

  return(`
    <div class=" task_list relative" _id = "${task_list._id}" isClicked = "0">
    <div class="list_heading inactive_list"  >
      ${task_list.name}
    </div>
    <div class="all_tasks_in_list">
      ${list_of_tasks}
    </div>
    <div class="add_additional_list_modal"> +  Add Task </div>
  </div>`);

}

const RenderAddList = (task) => {
   var id = task ? task._id : ""
  return (`
    <div class="relative"  _id = "${id}" isClicked = "0">

      <div class="list_heading inactive_list task_list create_list create_new "  >
        + Add List
      </div>

      <div class="add_list_modal"></div>

    </div>`);

}

const RenderAddTaskModal = (id) => {

  return (
    `<div class="create_list_inner_modal create_list_inner_modal--task" _id = "${id}">

      <input class="list_create_input" id = "taskInput" placeholder = "Enter Name" >
      <button class="list_create_button" id="addTask">
        + Add Task
      </button>
    </div>
    `
  )

}

const RenderAddListModal = () => {

  return (
    `<div class="create_list_inner_modal create_list--list">
     <p> Add New List </p>
      <input class="list_create_input" id = "listInput" placeholder = "Enter Name" >
      <button class="list_create_button" id = "addList">
        + Add List
      </button>
    </div>
    `
  )

}


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

function RenderList(){

  var html = ``;

  if(!chosen_board){
    return;
  }

  task_heading_container.innerHTML = `<p class="task_title">${chosen_board.name}</p>`

  html += RenderAddList(chosen_board);

  if(chosen_board.list.length <= 0){
    inner_container.innerHTML =  html;
    return;
  }

  for(var k = 0; k < chosen_board.list.length; k++){
    html += RenderListItem(chosen_board.list[k]);
  }

  inner_container.innerHTML =  html;


}

const AddEventToAddList = () => {

  var create_list = document.querySelector(".create_list");
  var add_list_modal = document.querySelector(".add_list_modal");

  create_list.addEventListener("click",(e)=>{

    ExitOutOfListModals();
    ExitOutOfTaskModals();

    isEditing = true;

    add_list_modal.innerHTML = RenderAddListModal();

    var create_button =  add_list_modal.querySelector("#addList");

    create_button.addEventListener("click",(e)=>{
      AddListToBoard(e,(result)=>{console.log(result)});
    })

  })

}

const AddEventsToAddTask = (element) => {

  var task_list = document.getElementsByClassName("task_list");

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

      var add_list_modal = element.querySelector(".add_additional_list_modal");

      if(add_list_modal){

        add_list_modal.innerHTML = RenderAddTaskModal(element.getAttribute("_id"));

        var create_button =  add_list_modal.querySelector("#addTask");

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

function RenderTaskItems(tasks){

  var html = ``;

  tasks.map((task)=>{

    var extra = "";

    if(task.description.length > 0){
      extra = `<div class="extra">...</div>`
    }

    html += `

    <div class="task_item_container" _id = ${task._id} status = ${task.status}>

      <p class="task_item_name">
        ${task.name}
      </p>

      ${extra}

    </div>`

  });

  return html;

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
        console.log(chosen_board);
    }

  }

}

async function InitMyBoard (){

   isEditing = false;

   await SetCurrentBoard();
   console.log(chosen_board);
   var background = chosen_board.background;
   var rgb = chosen_board.background;
   var color_data = chosen_board.background;

   if(chosen_board.background_img){
    background = chosen_board.background_img ? `url("/images/${chosen_board.background_img.filename}")` : chosen_board.background;
    rgb = chosen_board.background_img ?  chosen_board.background_img.filename : chosen_board.background;
    color_data = await axios.post("/api/color/all",{src:rgb});
   }

   var task_heading = document.querySelector(".task_heading");
   var side_nav = document.querySelector("#sidebackground");

   var linear_grad = `linear-gradient(to bottom`;

   task_heading.style.background = background;
   side_nav.style.background = background;

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

   RenderList();

   AddEventsToAddTask();

   AddEventToAddList();

}

// board_container.addEventListener("click",(e)=>{
//
//   if(isEditing){
//     ExitOutOfListModals();
//     ExitOutOfTaskModals();
//   }
//
// })



InitMyBoard();
