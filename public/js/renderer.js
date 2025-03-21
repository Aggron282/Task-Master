const RenderListItem = (task_list) => {
  var list_of_tasks = RenderTaskItems(task_list.list,task_list._id);
  return(`
    <div class=" task_list relative" _id = "${task_list._id}" data-list-id = "${task_list._id}" isClicked = "0">


      <div class="list_heading inactive_list"  >
        ${task_list.name}
      </div>

      <div class="all_tasks_in_list">
        ${list_of_tasks}
      </div>

      <div class="create_task_to_board_modal"></div>

      <div class="add_additional_list_modal" isEditing = "0"> +  Add Task </div>

  </div>`);

}

const ExitDetailPage = () => {

  var overlay = document.querySelector(".overlay");
  var detail_page = document.querySelector(".detail_page");
  var wrapper = document.querySelector(".wrapper");

  detail_page.classList.add("detail_page--away");
  wrapper.classList.add("overlay--away");
  overlay.classList.add("wrapper--away");
  var detail_container = document.querySelector(".detail-wrapper");
  setTimeout(()=>{
    detail_container.innerHTML = "";
  },500)
}

const RenderDetailPage = (task,board_id, task_id, list_id) => {

  return(
    `
    <div class="wrapper">
      <div class="overlay"></div>
      <div class="detail_page">
        <p class="exit" id = "exit-detail"">X</p>
          <form id = "detail-form"  data-task-id = "${task_id}" data-list-id = "${list_id}"  data-board-id = "${board_id}" >
              <div class="detail_grid">
                  <div class="main_container">
                      <div class="title_detail_container">
                          <input class="title_input" name = "title" value = "${task.name}" id = "task-name">
                          <div class="list_name_container">
                              <img class="o-img"src =""/>
                              <p class="title">Belongs to List 1 </p>
                          </div>
                      </div>
                      <div class="save_container">
                          <button class="save-btn">
                            Save Changes
                          </button>
                      </div>
                      <div class="notification_container">
                        <button class="option-card watch-btn">
                          <img class="o-img"  src = "/imgs/options/13.png"/>
                          <p class="title">Watch Task </p>
                        </button>
                      </div>
                      <div class="description_container">
                          <div class="list-art">
                              <div class="l-long l"></div>
                              <div class="l-long l"></div>
                              <div class="l-short l"></div>
                              <div class="l-short l"></div>

                          </div>
                          <p class="title">Description</p>
                      </div>
                      <div class="text-area-container">
                        <textarea class="description_box" id = "task-description" value =""  name = "description" rows = "3" cols="3">
                          ${task.description}
                        </textarea>

                      </div>
                      <div class="feature_container">

                          <div class="feature_box">
                            <img class="o-img" src = "/imgs/options/1.png"/>
                            <p class="title"> Add Cover </p>
                          </div>
                          <div class="feature_box">
                            <img class="o-img" src = "/imgs/options/1.png"/>
                            <p class="title"> Add Links </p>
                          </div>
                          <div class="feature_box">
                            <img class="o-img" src = "/imgs/options/1.png"/>
                            <p class="title"> Add Images </p>
                          </div>

                      </div>
                  </div>
                  <div class="side_container">
                      <div class="option-card">
                          <img class="o-img" src = "/imgs/options/1.png"/>
                          <p class="title">Add Member</p>
                      </div>
                      <div class="option-card">
                          <img class="o-img"  src = "/imgs/options/3.png"/>
                          <p class="title">Current Members</p>
                      </div>
                      <div class="option-card">
                          <img class="o-img"  src = "/imgs/options/9.png"/>
                          <p class="title">Move</p>
                      </div>
                      <div class="option-card">
                          <img class="o-img"  src = "/imgs/options/4.png"/>
                          <p class="title">Add Due Date</p>
                      </div>
                      <div class="option-card">
                          <img class="o-img" src = "/imgs/options/8.png"/>
                          <p class="title">Copy</p>
                      </div>
                      <div class="option-card option-card--archive">
                          <img class="o-img"  src = "/imgs/options/6.png"/>
                          <p class="title">Archive</p>
                      </div>
                      <div class="option-card option-card--delete">
                          <img class="o-img" src = "/imgs/options/7.png"/>
                          <p class="title">Delete</p>
                      </div>
                  </div>
              </div>
          </form>
      </div>
    </div>
    `
  )
}

const RenderAddList = () => {

    return (`
      <div class="relative" isClicked = "0">

        <div class="list_heading inactive_list task_list--add create_list create_new "  >
          + Add List
        </div>

        <div class="add_list_modal"></div>

    </div>`);

}

const RenderAddTaskModal = (id) => {

  return (
    `<div class="create_list_inner_modal--task" _id = "${id}">
      <input class="add_task_to_list_input" id = "taskInput" placeholder = "Enter Name" >
    </div>
    `
  )

}

const RenderAddListModal = () => {

  return (
    `<div class="create_list_inner_modal create_list--list create_list">

        <p> Add New List </p>

        <input class="list_create_input" id = "listInput" placeholder = "Enter Name" >

        <button class="list_create_button " id = "addList">
          + Add List
        </button>

    </div>
    `
  )

}


const  RenderList = (board)=>{

  var html = ``;

  if(!board){
    return html;
  }

  const task_heading_container = document.querySelector(".task_heading_container");

  task_heading_container.innerHTML = `<p class="task_title">${board.name}</p>`

  html += RenderAddList(board);

  if(board.list.length <= 0){
    return html;
  }

  for(var k = 0; k < board.list.length; k++){
    html += RenderListItem(board.list[k]);
  }

  return html;

}


function RenderTaskItems(tasks,list_id){

  var html = ``;

  tasks.map((task)=>{

    var extra = "";

    if(task.description.length > 0){
      extra = `<div class="extra">...</div>`
    }
    if(task.isArchived != true){
      html += `

      <div class="task_item_container" _id = ${task._id} data-task-id = ${task._id}  data-list-id = "${list_id}" status = ${task.status}>

        <p class="task_item_name">
          ${task.name}
        </p>

        ${extra}

      </div>`
    }

  });

  return html;

}


function RenderTaskboard(board){

  var no_space_name = board.name.replace(/\s/g, '');

  var background = board.background_img ? `url('/images/${board.background_img.filename}')` : board.background;

  return(
    `
    <div class="taskboard" style = "background:${background}" id = "${board._id} name = "${board.name}">
      <a href = "/my_board/id=:${board._id}/name=:${no_space_name}">
      <div class = "inner_board">
        <p class="task_heading">${board.name}</p>

      </div>
      </a>
      <div class="delete_button_" ownerID = "${board.ownerID}" id = "${board._id}">X </div>
    </div>
    `
  );

}

function RenderErrorBannerElement(color,message){

  return(`
    <div class="inner_banner" style="background:${color}" onClick = "DeleteBanner">
      <p class="error_message"> ${message} </p>
    </div>
  `);

}

function RenderModalElement(colors){

  return(`
    <div class="modal_board">

      <div class="error_banner"></div>

      <p id="exit_modal"> X </p>

      <p class="title"> Choose Background </p>

      ${RenderColorElements()}

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

  </div>`)

}

function RenderColorElements(){

  var html = ``;

  for(var i = 0; i < colors.length; i++){

    if(i < 1){
      html += `<div class="color_box color_active" style="background:${colors[i]}">  </div>`
      active_color = colors[i];
    }
    else{
      html += `<div class="color_box" color = "${colors[i]}" style="background:${colors[i]}"></div>`
    }

  }

  board_modal_wrapper.style.background = active_color;

  return html;

}
