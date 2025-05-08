const board_container = document.querySelector(".my_taskboard_container");
const inner_container = document.querySelector(".inner_container_task");
const task_heading_container = document.querySelector(".task_heading_container");
var didInit = false;
const url = window.location.href;
const name = url.split("name=:")[1];

let id = url.split("id=:")[1];

var chosen_board;

var isEditingTask = false;
var isEditing = false;
var didSetColors = false;

var showArchiveOnly = false;
var showAll = false;
var showWatched  = false;

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

const ChangeTaskState = async (e, url, isRemoving) => {
  e.preventDefault();
  var {board_id,list_id,task_id} = GetTaskData();

  var {data} = await axios.post(url, {board_id: board_id, list_id: list_id, task_id: task_id});

  if(isRemoving){

    const showAll = localStorage.getItem('show_all') === 'true';
    const showArchivedOnly = localStorage.getItem('show_archived_only') === 'true';
    const taskElement = document.querySelector(`.task_item_container[_id="${task_id}"]`)
    if (!showAll && !showArchivedOnly && taskElement) {
      taskElement.remove();
    }

  }

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

        var detail_container = document.querySelector(".detail-wrapper");

        var html = RenderDetailPage(data.task.task, id, element.dataset.taskId, element.dataset.listId);

        detail_container.innerHTML = html;
        var watch_input = document.querySelector(".watch-input");
        console.log(data.task.task);
        watch_input.checked = data.task.task.watching;

        var move_task_button = document.querySelector("#move_task_button");
        var copy_task_button = document.querySelector("#copy_task_button");

        move_task_button.addEventListener("click",(e)=>{
          GenerateMoveBoardModal(e,true);
        });

        copy_task_button.addEventListener("click",(e)=>{
          GenerateMoveBoardModal(e,false);
        });

        InitAttacher();
        InitLinkAdder(data.task.task.links);

        var exit = document.querySelector("#exit-detail")
        var save_btn = document.querySelector(".save-btn");
        var archive_btn = document.querySelector(".option-card--archive");
        var delete_btn = document.querySelector(".option-card--delete");
        var watch_btn = document.querySelector(".watch-btn");
        var label_maker = document.querySelector(".label-maker");
        var label_modal = document.querySelector("#label-modal");
        var exit_label_maker = document.querySelector(".exit-label-modal");
        var detail_page = document.querySelector(".detail_page");

        save_btn.addEventListener("click", async (e) => {
          SaveTaskChange(e);
        });

        label_maker.addEventListener("click",async (e)=>{

          label_modal.classList.add("label-modal--active");

          var label_list = document.querySelector(".label-modal-list");
          var label_items = document.querySelectorAll(".label-modal-item");

          async function ActivateLabels(type){

            const { board_id, list_id, task_id } = GetTaskData();

            for(var i = 0; i < label_items.length; i++){

              if(label_items[i].dataset.labelType == type){

                label_items[i].classList.add("label-modal-item--active");
                detail_page.style.borderColor = label_items[i].dataset.color;

                var _id = label_modal.dataset.taskId;
                var task_item =  document.querySelector(`.task_item_container[data-task-id="${_id}"]`);
                var {data} = await axios.post("/api/task/label",{task_id:task_id, list_id:list_id, board_id:board_id,label:type});

                task_item.style.border = `${label_items[i].dataset.color} 3px solid`;
              }
              else{
                label_items[i].classList.remove("label-modal-item--active");
              }

            }

          }

          for(var i = 0; i < label_items.length; i++){

              label_items[i].addEventListener("click",(e)=>{
                  e.stopPropagation();
                  console.log(e.target.dataset.labelType)
                  var type = e.target.dataset.labelType;
                  ActivateLabels(type);
              });

          }

        });

        exit_label_maker.addEventListener("click",async (e)=>{
          e.stopPropagation();
          label_modal.classList.remove("label-modal--active");
        });

        archive_btn.addEventListener("click", async (e)=>{
          ChangeTaskState(e,"/api/task/archive",true)
        });

        delete_btn.addEventListener("click", async (e)=>{
          ChangeTaskState(e,"/api/task/delete",true)
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

let showButtonEventsAttached = false;



function StyleShowBars(showAll = false,showArchiveOnly = false, showWatched = false){

  const show_archive_tasks = document.querySelector(".menu-item--archive");
  const show_all_tasks = document.querySelector(".menu-item--all");
  const show_watch_tasks = document.querySelector(".menu-item--watch");

  const active = "menu-item--active";
  const filter_wrapper = document.querySelector(".filter-wrapper");
  const none = "none";

  if(showArchiveOnly){
    show_archive_tasks.classList.add(active);
    show_all_tasks.classList.remove(active);
    show_watch_tasks.classList.remove(active);
    filter_wrapper.innerHTML = "Archived"
  }
  else if(showAll){
    show_all_tasks.classList.add(active);
    show_archive_tasks.classList.remove(active);
    show_watch_tasks.classList.remove(active);
    filter_wrapper.innerHTML = "All"
  }
  else if(showAll == false && showArchiveOnly == false && showWatched == false){
    show_all_tasks.classList.remove(active);
    show_archive_tasks.classList.remove(active);
    show_watch_tasks.classList.remove(active);
    filter_wrapper.innerHTML = "Standard"
  }
  else if(showWatched){
    show_all_tasks.classList.remove(active);
    show_archive_tasks.classList.remove(active);
    show_watch_tasks.classList.add(active);
    filter_wrapper.innerHTML = "Watched"
  }

}

const AddShowButtonEvents = () => {

  if (showButtonEventsAttached) return;

  showButtonEventsAttached = true;

  const show_archive_tasks = document.querySelector(".menu-item--archive");
  const show_all_tasks = document.querySelector(".menu-item--all");
  const show_watch_tasks = document.querySelector(".menu-item--watch");
  const show_standard = document.querySelector(".menu-item--standard");

  show_archive_tasks.addEventListener("click", () => {

    const togglingOn = !showArchiveOnly;

    showArchiveOnly = togglingOn;
    showAll = false;

    localStorage.setItem("show_archived_only", togglingOn);
    localStorage.setItem("show_all", false);
    localStorage.setItem("show_watch", false);

    StyleShowBars(false,togglingOn,false);

    InitMyBoard();

  });

  show_standard.addEventListener("click", () => {

    const togglingOn = false;

    showArchiveOnly = false;
    showAll = false;

    localStorage.setItem("show_archived_only", false);
    localStorage.setItem("show_all", false);
    localStorage.setItem("show_watch", false);

    StyleShowBars(false,false,false);

    InitMyBoard();

  });

  show_all_tasks.addEventListener("click", () => {

    const togglingOn = !showAll;

    showAll = togglingOn;
    showArchiveOnly = false;

    localStorage.setItem("show_all", togglingOn);
    localStorage.setItem("show_archived_only", false);

    StyleShowBars(togglingOn,false,false);

    InitMyBoard();

  });

  show_watch_tasks.addEventListener("click", () => {

    const togglingOn = !showWatched;

    localStorage.setItem("show_watch", togglingOn);
    localStorage.setItem("show_all", false);
    localStorage.setItem("show_archived_only", false);

    StyleShowBars(false,false,togglingOn)

    InitMyBoard();

  });

};

const AddEventsToMove = () => {

  var move_buttons = document.querySelectorAll(".move--list");

  for(var i =0; i < move_buttons.length; i++){

    move_buttons[i].addEventListener("click",(e)=>{

      GenerateMoveBoardModal(e,false);

    });

  }

}

function GenerateMoveBoardModal(e, isTaskMoving = false){

  e.stopPropagation();
  e.preventDefault();

  var parentElement =  e.target.parentElement.parentElement;
  var _id = parentElement.getAttribute("_id");

  var modal = document.querySelector(".lbl-list-settings-modal");
  var type = isTaskMoving  == true ? 1 : 0;
  var move_canopy = document.querySelector(".move-canopy");

  move_canopy.setAttribute("type",type);

  var exit_modal = modal.querySelector(".lbl-exit");

  exit_modal.addEventListener("click",(e)=>{
    modal.classList.remove("list-settings-modal--active");
  });

  modal.classList.add("list-settings-modal--active");

  var holder = modal.querySelector(".list-board-holder");
  var move_board_wrapper = document.querySelector(".move-board-wrapper");

  move_board_wrapper.classList.remove("hidden");

  GenerateOtherBoards(holder);

}

const AddEventsToMore = () => {

  var more_buttons = document.querySelectorAll(".more");

  for(var i =0; i < more_buttons.length; i++){

    more_buttons[i].addEventListener("click",(e)=>{

      e.stopPropagation();

      e.preventDefault();

      var parentElement =  e.target.parentElement;

      var _id = parentElement.getAttribute("_id");

      var modal = parentElement.querySelector(".list-settings-modal");
      var exit_modal = modal.querySelector(".lsm-exit");

      exit_modal.addEventListener("click",(e)=>{
        modal.classList.remove("list-settings-modal--active");
      });

      modal.classList.add("list-settings-modal--active");

    });

  }

}

const InitMyBoard = async () => {

  isEditing = false;
  isEditingTask = false;

  showAll = localStorage.getItem('show_all') === 'true';
  showArchiveOnly = localStorage.getItem('show_archived_only') === 'true';
  showWatched = localStorage.getItem('show_watch') === 'true';

  await SetCurrentBoard();

   if(!didSetColors){
     SetDynamicColors(chosen_board);
     didSetColors = true;
   }

   ExitOutOfListModals();
   ExitOutOfTaskModals();

   BuildListHTML(chosen_board,showAll,showArchiveOnly,showWatched);

   AddEventToAddList();
   AddEventsToAddTask();

   AddEventsToMore();
   AddEventsToMove();

   EnableDragDrop();

   AddClickEventsToTasks();

   if(!didInit){
     AddShowButtonEvents();
  }

  StyleShowBars(showAll,showArchiveOnly,showWatched);

  didInit = true;

}

const BuildListHTML = async (board,showAll,showArchiveOnly,showWatched) =>{

  var html = RenderList(board,showAll,showArchiveOnly,showWatched);

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
    // current_background[2] = current_background[2].replace(")","")

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
