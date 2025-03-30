const board_container = document.querySelector(".my_taskboard_container");
const inner_container = document.querySelector(".inner_container_task");
const task_heading_container = document.querySelector(".task_heading_container");

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

    create_button.addEventListener("click",(e)=>{
      AddListToBoard(e,(result)=>{console.log(result)});
    });

  });

}

const SaveTaskChange = async (e) => {

  e.preventDefault();

  const form = document.querySelector("#detail-form");
  const { board_id, list_id, task_id } = GetTaskData();

  const taskElement = document.querySelector(`.task_item_container[data-task-id="${task_id}"]`);

  const form_data = {
    name: form.querySelector("#task-name").value,
    description: form.querySelector("#task-description").value,
    date: form.querySelector(".date-board").value,
    watching: form.querySelector(".watch-input").checked
  };

  const task_data = {
    name: taskElement?.querySelector(".task_item_name"),
    description: taskElement?.querySelector(".description_holder"),
    date: taskElement?.querySelector(".deadline_holder"),
    watching: taskElement?.querySelector(".watch_holder")
  }

  if (form_data.name && task_data.name) {
    task_data.name.innerText = form_data.name;
  }

  console.log(form_data)
  // if (task_data.description.innerHTML.trim() === "") {
    task_data.description.innerHTML = form_data.description?.length > 0 ? menu_icon : "";
  // }

  // if (task_data.description.innerHTML.trim() === "") {
    task_data.date.innerHTML = form_data.date?.length > 0 ? deadline_icon : "";
  // }

  // if (task_data.watching.innerHTML.trim() === "") {
    task_data.watching.innerHTML = form_data.watching ? watch_icon : "";
  // }

  const { data } = await axios.post("/api/task/change", {
    form: form_data,
    board_id,
    list_id,
    task_id
  });

  ExitDetailPage();

}

function GetTaskData(){

  var form = document.querySelector("#detail-form");
  var board_id = form.dataset.boardId;
  var list_id = form.dataset.listId;
  var task_id = form.dataset.taskId;

  return {
    board_id: board_id,
    list_id:list_id,
    task_id:task_id
  }

}

const WatchTask = async (e,watch_btn) => {

  e.preventDefault();

  var watch_input = watch_btn.querySelector(".watch-input");

  watch_input.checked = !watch_input.checked;

  if(watch_input.checked){
    watch_btn.classList.add("watching--active");
  }
  else{
    watch_btn.classList.remove("watching--active");
  }

}

const ChangeTaskState = async (e, url) => {
  e.preventDefault();
  var {board_id,list_id,task_id} = GetTaskData();
  var {data} = await axios.post(url, {board_id: board_id, list_id: list_id, task_id: task_id});
  ExitDetailPage();
}

const AddClickEventsToTasks = () =>{

    const taskLists = document.querySelectorAll('.task_list');

    taskLists.forEach((list) => {

      list.addEventListener("click", async (e)=>{

        e.preventDefault();
        e.stopPropagation();

        var element = e.target;
        var p_element = element.querySelector(".task_item_name");
        var description_holder = element.querySelector(".description_holder");

        if(!element.dataset.taskId){
          element = e.target.parentElement;
        }

        if(!element.classList.contains("task_item_container")){
          return;
        }

        var {data} = await axios.get(`/api/task/${id}/${element.dataset.listId}/${element.dataset.taskId}`);

        var html = RenderDetailPage(data.task.task, id, element.dataset.taskId, element.dataset.listId);
        var detail_container = document.querySelector(".detail-wrapper");

        detail_container.innerHTML = html;

        var exit = document.querySelector("#exit-detail")
        var save_btn = document.querySelector(".save-btn");
        var archive_btn = document.querySelector(".option-card--archive");
        var delete_btn = document.querySelector(".option-card--delete");
        var watch_btn = document.querySelector(".watch-btn");

        save_btn.addEventListener("click", async (e) => {
          SaveTaskChange(e);
        });

        archive_btn.addEventListener("click", async (e)=>{
          ChangeTaskState(e,"/api/task/archive")
        });

        delete_btn.addEventListener("click", async (e)=>{
          ChangeTaskState(e,"/api/task/delete")
        });

        watch_btn.addEventListener("click", async (e)=>{
          WatchTask(e,watch_btn);
        });

        exit.addEventListener("click",(e)=>{
          ExitDetailPage();
        });

    });

  });

}

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

        });

    }

}

const AddTaskToDBEvent = (e) => {

  var parent = e.target.parentElement
  var _id = parent.getAttribute("_id");
  var modal_container = parent.querySelector(".create_task_to_board_modal");

  modal_container.innerHTML = RenderAddTaskModal(_id);

  e.target.setAttribute("isEditing",1);

  var add_task_button_to_db = modal_container.parentElement.querySelector(".add_additional_list_modal");

  add_task_button_to_db.addEventListener("click", async (e)=>{

    var parent = e.target.parentElement;

    if(e.target.getAttribute("isEditing") == 0 && isEditingTask){
      return;
    }

    var task_input = parent.querySelector(".add_task_to_list_input");

    isEditingTask = true;

    if(task_input.value.length < 1){
      alert("Task is Empty");
    }
    else{

      isEditingTask = false;

      var _id = parent.getAttribute("_id");

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
   AddClickEventsToTasks();

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

  }

}

InitMyBoard();
