const menu_icon=`
<svg
xmlns="http://www.w3.org/2000/svg"
width="24" height="24"
viewBox="0 0 24 24"
fill="none" stroke="currentColor"
stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
>
<line x1="3" y1="12" x2="21" y2="12" />
<line x1="3" y1="6" x2="21" y2="6" />
<line x1="3" y1="18" x2="21" y2="18" />
</svg>
`
const watch_icon = `
<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-eye" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
</svg>
`

const deadline_icon =
`
  <svg
  xmlns="http://www.w3.org/2000/svg"
  width="24" height="24"
  viewBox="0 0 24 24"
  fill="none" stroke="currentColor"
  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
  >
  <circle cx="12" cy="14" r="8" />
  <line x1="12" y1="14" x2="12" y2="10" />
  <line x1="9" y1="2" x2="15" y2="2" />
  <line x1="12" y1="6" x2="12" y2="6" />
  </svg>

`
const labels = [
  { name: "Warning", color: "#2e7d32", type: 0 },
  { name: "Urgent", color: "#f9a825", type: 1 },
  { name: "High Priority", color: "#d32f2f", type: 2 },
  { name: "Low Priority", color: "#ef6c00", type: 3 },
  { name: "Habit", color: "#7e57c2", type: 10 },
  { name: "Incomplete", color: "#1976d2", type: -1 },
  { name: "None", color: "grey", type: -100 }
];

function getLabelByType(labelType) {
  console.log(labelType)
  for (let i = 0; i < labels.length; i++) {
    console.log(labels[i].type  == labelType)
      if (labels[i].type == labelType) {
        return labels[i];
        break;
      }
  }
}

const ReturnLabelItem = (label)=>{
  if(label != null){
    var {color,type,name} = getLabelByType(label);
    return(`
      <div class="label-modal-item" data-color ="${color}" data-is-active = "0" data-label-type="${type}" style="--label-color: ${color};">${name}</div>

      `)
  }else{
    return "";
  }
}
const ReturnLabelModal = (task_id) => {
  var html = ``;
  for(var i =0; i < labels.length; i++){
    html += ReturnLabelItem(labels[i].type);
  }
  return (
    `
    <div id="label-modal" class="label-modal" data-task-id="${task_id}">
      <p class="exit-label-modal exit">X</p>

      <div class="label-modal-content">
        <h2 class="label-modal-title">Labels</h2>

        <div class="label-modal-list">
          ${html}
        </div>

        <button class="label-modal-btn">New Feature Coming Soon</button>
      </div>
    </div>


    `
  );

}

function ReturnLabel(label){
  var html = ``;
  if(!label || label == -100){
    return html;
  }
  var {color,type,name} = getLabelByType(label);

        html = (
          `
          <div class="label-marker"style="background:${color}" data-type = "${type}" data-color="${color}">
            <p class='title'>${name} </p>
          </div>
          `
        )

    return html;

}

function ReturnLabelPreview(label){
  var html = ``;
  if(!label || label == -100){
    return html;
  }
  var {color,type,name} = getLabelByType(label);

        html = (
          `
          <div class="label-marker--preview"style="background:${color}" data-type = "${type}" data-color="${color}">
          </div>
          `
        )

    return html;

}

function ReturnLoaderTaskItem(){
  return(
    `
    <div class="dark-loader-container">
      <div class="dark-loader"></div>
    </div>
    `
  )
}

function ReturnBackgroundLoader(){
  return(
    `
    <div class="shimmer-loader">
      <div class="shimmer-overlay"></div>
    </div>
    `
  )
}
function ReturnBoardLoader(){
    return(
        `
        <div class="card shimmer-bg-loader">
        </div>

        `
    )
}

const ReturnBoardMoveItem  = (board) =>{
  var isImg = board.background_img != null ? true :false;

  if(isImg){
    return (
      `
      <div class="board-move-item" board_id = "${board._id}">
        <img src = "/images/${board.background_img.filename}" class="board-preview" board_id = "${board._id}"/>
        <p class="title" board_id = "${board._id}">
          ${board.name}
        </p>
      </div>
      `
    )
  }else{
    return (
      `
      <div class="board-move-item" board_id = "${board._id}">
        <div style="background:${board.background}" class="board-preview" board_id = "${board._id}"></div>
        <p class="title" board_id = "${board._id}">
          ${board.name}
        </p>
      </div>
      `
    )
  }
}

const ReturnListMoveItem  = (list) =>{
    return (
      `
      <div class= "list-move-item board-move-item" list_id = "${list._id}">
        <p class="title" list_id = "${list._id}">
          ${list.name}
        </p>
      </div>
      `
    )

}

function RenderLinkAdderModal(links = []) {
  let link_html = ``;
  console.log(links)
  for (let i = 0; i < links.length; i++) {
    const { name, url, _id } = links[i];
    link_html += `
      <div class="link-preview" data-id="${_id}">
        <div class="link-info">
        <a href="${url}" target="_blank">  <svg class="link-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M6.354 5.5H4a2 2 0 0 0 0 4h2.354a.5.5 0 1 1 0 1H4a3 3 0 0 1 0-6h2.354a.5.5 0 1 1 0 1z"/>
            <path d="M11.646 10.5H14a2 2 0 0 0 0-4h-2.354a.5.5 0 1 1 0-1H14a3 3 0 0 1 0 6h-2.354a.5.5 0 1 1 0-1z"/>
            <path d="M5.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4A.5.5 0 0 1 5.5 8z"/>
          </svg></a>
          <span class="link-name">${name}</span>
        </div>
        <button class="more-btn" onclick="toggleLinkOptions(this)">...</button>
        <div class="link-options hidden">
          <button onclick="toggleLinkPOptions(this)">Go Back</button>
          <a href="${url}" target="_blank">Go to Link</a>
          <button onclick="deleteLink('${_id}')">Delete</button>
        </div>
      </div>
    `;
  }

  return `
    <div class="attachment-modal hidden" id="linkModal">
      <div class="modal-content">
        <button class="close-btn" onclick="toggleLinkModal(false)">×</button>
        <h2 class="modal-title">Links</h2>
        <div class="file-grid" id="linkGrid">
          <label class="add-file-btn">
            <button id="linkInput" type="text" placeholder="Paste link...">
            +
            </button>
          </label>
          ${link_html}
        </div>
      </div>
    </div>
  `;
}

function RenderInnerLinkModal(){
  return (
    `
    <div class="inner-overlay hidden" id="innerLinkModal">
    <div class="inner-modal-content">
      <button class="inner-close-btn" onclick="toggleInnerLinkModal(false)">×</button>
      <h2 class="inner-modal-title">Add New Link</h2>

      <div class="inner-modal-form">
        <input id="innerLinkName" type="text" placeholder="Link Name" />
        <input id="innerLinkURL" type="text" placeholder="https://example.com" />
        <button id = "innerSubmitLink">Submit</button>
      </div>
    </div>
  </div>


    `
  )
}


const ReturnMoveToBoardModal = (boards) =>{

  var board_html = "";

  for(var i=0; i < boards.length; i++){
    board_html += ReturnBoardMoveItem(boards[i]);
  }

  return (`
    <div class="move-wrapper hidden move-board-wrapper" data-type = "0">
      <div class="move-modal">
        <p class="title">Move To Board</p>
        <p class="exit exit--board--modal">Cancel</p>
        <div class="board-holders">
          ${board_html}
        </div>
      </div>
    </div>
    `);

}

const ReturnMoveToListModal = (board) =>{
  console.log(board)
  var board_html = "";

  for(var i=0; i < board.list.length; i++){
    board_html += ReturnListMoveItem(board.list[i]);
  }

  return (`
    <div class="move-wrapper move-list-wrapper hidden" data-type = "0" board_id = "${board._id}">
      <div class="move-modal--list move-modal">
        <p class="title">Move To List</p>
        <p class="exit exit--list--modal">Go Back</p>
        <div class="board-holders">
          ${board_html}
        </div>
      </div>
    </div>
    `);
}

const RenderListItem = (task_list,showAll,showArchiveOnly,showWatched) => {

  console.log(task_list)

  if(!task_list){
    return ReturnLoaderTaskItem();
  }

  var list_of_tasks = RenderTaskItems(task_list.list,task_list._id, showAll, showArchiveOnly,showWatched);

  return(`
    <div class=" task_list relative in" _id = "${task_list._id}" data-list-id = "${task_list._id}" isClicked = "0">


      <div class="list_heading inactive_list"  _id = "${task_list._id}" data-list-id = "${task_list._id}" >
        <p>${task_list.name}</p>
        <p class="more" data-toggle = "0" > ... </p>

        ${ReturnListModal(task_list._id)}
        ${ReturnBoardListModal(task_list._id)}

      </div>

      <div class="all_tasks_in_list">
        ${list_of_tasks}
      </div>

      <div class="create_task_to_board_modal"></div>

      <div class="add_additional_list_modal" isEditing = "0"> +  Add Task </div>

  </div>`);

}

const ReturnProfileDefaultImg = (name) => {

  var {background,text } = getRandomColorWithContrast();
  return (
    `
    <div class="profile-avatar" style="background:${background}">
      <p style="color:${text}">  ${name.substring(0,2)} </p>
    </div>
    `
  );

}

const ReturnProfileModal = (user_id, name,username,password) => {
  return(
    `
    <div class="profile-wrapper">
      <div class="profile-overlay"></div>

    <div class="profile-modal">
      <div class="profile-modal-header">
        <h2>Edit Profile</h2>
        <button class="profile-close-btn">&times;</button>
      </div>

      <div class="profile-avatar-section">
        <div class="profile-img-wrapper">
          <div class="profile-avatar">P</div>
        </div>
        <label class="profile-upload-btn">
          Upload
          <input type="file"  class="profile-input profile-file-input upload" name = "image" />
        </label>
      </div>

      <div class="profile-input-group">
        <label for="name">Full Name</label>
        <div class="profile-input-wrap">
          <input type="text"  class="profile-input" value = "${name}" id="name" placeholder="Your name"  name = "name"/>
          <svg class="profile-pencil-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2.146-2.146 1.043-1.043a.5.5 0 0 1 .707 0l1.439 1.439zm-1.75 2.456L6 12.147V14h1.854l7.752-7.752-1.854-1.853z"/>
          </svg>
        </div>
      </div>

      <div class="profile-input-group">
        <label for="username">Username</label>
        <div class="profile-input-wrap">
          <input type="text" id="username" value = "${username}"  class="profile-input" placeholder="Your username" name = "username"/>
          <svg class="profile-pencil-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2.146-2.146 1.043-1.043a.5.5 0 0 1 .707 0l1.439 1.439zm-1.75 2.456L6 12.147V14h1.854l7.752-7.752-1.854-1.853z"/>
          </svg>
        </div>
      </div>

      <div class="profile-input-group">
        <label for="username">Password</label>
        <div class="profile-input-wrap">
          <input type="text" id="username"  value = "${password}" class="profile-input" placeholder="********" name = "password"/>
          <svg class="profile-pencil-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2.146-2.146 1.043-1.043a.5.5 0 0 1 .707 0l1.439 1.439zm-1.75 2.456L6 12.147V14h1.854l7.752-7.752-1.854-1.853z"/>
          </svg>
        </div>
      </div>



      <div class="profile-input-group">
        <label for="username">Confirm Password</label>
        <div class="profile-input-wrap">
          <input type="text" id="username"  value = "${password}" class="profile-input" placeholder="*********" name = "confirm"/>
          <svg class="profile-pencil-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2.146-2.146 1.043-1.043a.5.5 0 0 1 .707 0l1.439 1.439zm-1.75 2.456L6 12.147V14h1.854l7.752-7.752-1.854-1.853z"/>
          </svg>
        </div>
      </div>


      <button class="profile-save-btn">Save Changes</button>

      <span class="profile-delete-btn">Delete Account</span>
    </div>
  </div>
    `
  )

}
/*

      <div class="profile-input-group">
        <label for="password">New Password</label>
        <input type="password" id="password" class="profile-input" placeholder="••••••••" name="password" />
      </div>

      <div class="profile-input-group">
        <label for="confirm">Confirm Password</label>
        <input type="password" id="confirm"  class="profile-input" placeholder="••••••••" name="confirm" />
      </div>
*/
const ReturnListModal = (list_id) =>{

  var html = `
  <div class="list-settings-modal" list_id = "${list_id}" >
    <div class="lsm-sidebar">
      <div class="lsm-title-container">
        <h2>List actions</h2>
        <span class="lsm-exit exit-list-modal"> X </span>
      </div>
      <div class="list-modal-grid" list_id = "${list_id}">
        <button>Add card</button>
        <button class="list-action--copy">Copy list</button>
        <button class="list-action--move">Move list</button>
        <button>Sort by...</button>
        <button>Watch</button>
      </div>
    </div>
  </div>
  `

  return html;

}

const ReturnBoardListModal = (list_id, boards) =>{

  var html = `
  <div class="lbl-list-settings-modal" list_id = ${list_id} >
    <div class="lbl-sidebar">
      <div class="lbl-title-container">
        <h2>Move To</h2>
        <span class="lbl-exit exit-list-modal"> X </span>
      </div>
      <div class="list-board-holder">

      </div>
    </div>
  </div>
  `

  return html;

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

  var watching_class = task.watching ? "watching--active" : "";
  var label = task.label;
  var label_html = ReturnLabel(label);
  return(
    `
    <div class="wrapper">

      <div class="overlay"></div>

      <div class="detail_page">

        <p class="exit" id = "exit-detail"">X</p>
        <div class="task_label_container">${label_html}</div>
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

                        <button class="option-card watch-btn ${watching_class}">
                          <img class="o-img"  src = "/imgs/options/13.png"/>
                          <p class="title">Watch Task </p>
                          <input class="watch-input" type="checkbox" name = "watched"/>
                        </button>

                      </div>

                      <div class="date_container">

                        <div class="option-card">
                            <img class="o-img"  src = "/imgs/options/4.png"/>
                            <p class="title">Add Due Date</p>
                            <input value = "${task.deadline}" class="date-board" style="width:100%;min-width:300px;background:none;border:none;color:white;font-size:22px" type="date" id="date" name="date" />
                        </div>

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
                        <textarea class="description_box" id="task-description" name="description" rows="1" cols="3">${task.description}</textarea>
                      </div>

                      <div class="feature_container">


                          <div class="feature_box link-adder-box" onclick="toggleLinkModal(true)">
                            <img class="o-img" src = "/imgs/options/1.png"/>
                            <p class="title"> Add Links </p>
                          </div>

                          <div class="feature_box attachment-box" onclick="toggleModal(true)" >
                            <img class="o-img" src = "/imgs/options/1.png"/>
                            <p class="title"> Add Images </p>
                          </div>

                      </div>

                  </div>

                  <div class="side_container">

                      <div class="option-card label-maker">
                          <img class="o-img" src = "/imgs/options/1.png"/>
                          <p class="title">Add Label</p>
                          <div class="label-modal md relative">
                            ${ReturnLabelModal(task_id)}
                          </div>
                      </div>
                      <div class="option-card" id = "move_task_button" >
                          <img class="o-img"  src = "/imgs/options/9.png"/>
                          <p class="title">Move</p>
                      </div>

                      <div class="option-card" id = "copy_task_button">
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
      <div class="attacher-wrapper">
        ${RenderFileAdderModal(task.attachments)}
      </div>
      <div class="link-adder-wrapper">
        ${RenderLinkAdderModal([])}
      </div>
      <div class="inner-link-adder-wrapper">
        ${RenderInnerLinkModal()}
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

const  RenderList = (board,showAll,showArchiveOnly,showWatched)=>{

  if(!board){
    for(var k = 0; k < 6; k++){
      html += RenderListItem(null);
    }

    return html;

  }

  var html = ``;

  if(!board){
    return html;
  }

  const task_heading_container = document.querySelector(".task_heading_container");

  task_heading_container.innerHTML = `<p class="task_title" id = "boardtitle">${board.name}</p>`

  html += RenderAddList(board);

  if(board.list.length <= 0){
    return html;
  }

  for(var k = 0; k < board.list.length; k++){
    html += RenderListItem(board.list[k],showAll,showArchiveOnly,showWatched);
  }

  return html;

}

function RenderTaskItems(tasks,list_id,showAll = false, showArchiveOnly = false, showWatched = false){

  var html = ``;

  tasks.map((task)=>{

    var extra = "";

    var name = task.name;
    var description_html = task.description.length > 0 ? menu_icon : "";
    var deadline_html = task.deadline.length > 0 ? deadline_icon : "";
    var watch_html = task.watching ? watch_icon : "";

    let should_show = false;
    const isArchived = task.isArchived === true;
    const isWatched = task.watching === true;

     if (showAll) {
       should_show = true;
     } else if (showArchiveOnly) {
       should_show = isArchived;
     } else if(showWatched) {
       should_show = isWatched;
     }else{
       should_show = !isArchived;
     }
     console.log( ReturnLabelPreview(task.type),task.label);
    if(should_show){
      html += `

      <div class="task_item_container in" _id = ${task._id} data-task-id = ${task._id}  data-list-id = "${list_id}" status = ${task.status}>
        <div class="label_preview_container">
          ${ReturnLabelPreview(task.label)}
        </div>
        <p class="task_item_name">
          ${task.name}
        </p>

        <div class="icon_holders">
          <div class="description_holder">
          ${description_html}
          </div>
          <div class="deadline_holder">
          ${deadline_html}
          </div>
          <div class="watch_holder">
          ${watch_html}
          </div>
        </div>

        ${extra}

      </div>`
    }

  });

  return html;

}

function RenderTaskboard(board){

  var no_space_name = board.name.replace(/\s/g, '');

  var background = board.background_img ? `url('/images/${board.background_img.filename}')` : board.background;

  var hidden = board.isFavorite === true ? "" : "hidden";

  return(
    `
    <div class="taskboard in"  id = "taskboard" style = "background:${background}" board_id = "${board._id}" name = "${board.name}">
      <a href = "/my_board/id=:${board._id}/name=:${no_space_name}">
      <div class = "inner_board">
        <p class="task_heading" id = "taskboardname">${board.name}</p>

      </div>
      </a>
      <div class="favorite-board ${hidden}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="yellow" viewBox="0 0 24 24">
        <path d="M12 2l2.9 6.9L22 10l-5 4.9L18 22l-6-3.5L6 22l1-7.1L2 10l7.1-1.1L12 2z"/>
      </svg>

      </div>
      <div class="delete_button_" ownerID = "${board.ownerID}" board_id = "${board._id}">X </div>
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

      <div class="color-grid">
        ${RenderColorElements()}
      </div>
      <br />
      <br />

      <form method = "POST" action = "/board/create" id="createboard"  enctype = "multipart/form-data">
        <label> Color Picker </label>
        <input class="chosen_color_input" value='${colors[0]}' name="background" type="color"/>
        <br>
        <p class="title"> Choose Uploaded Background </p>

        <input type='file' class=" upload_button" name="thumbnail"  placeholder="Image URL">

        <br />

        <p class="title"> Choose Name of Board </p>

        <input class="board_input" id = "board_name" name="name" placeholder = "Name of Board">

        <button class="add_board_button showcase_button" type = "submit"> Add Board </button>

        </form>

  </div>`)

}


function ReturnFilePreviewHTML(originalName, fileName, mimeType,_id) {

    var displayImage = ReturnType(mimeType);

    displayImage = displayImage == null ? "/files/"+fileName : displayImage;

    const html = `
      <div class="file-preview">
        <p class="delete-file" data-id="${_id}" onclick="DeleteOneFile(event)">X</p>
        <img src="${displayImage}"  onclick="window.open('/files/${fileName}', '_blank')" alt="${displayImage}" style="width: 100px;">
        <p>${originalName}</p>
      </div>
    `;

    return html;

}

 function RenderFileAdderModal(attachments = []){

  var attachment_html = ``;

  for(var i =0; i < attachments.length;i++ ){

    var {originalname, filename, mimetype, _id} = attachments[i];

    attachment_html += ReturnFilePreviewHTML(originalname,filename,mimetype,_id);

  }

  return (`
    <div class="attachment-modal hidden" id="attachmentModal">
    <div class="modal-content">
      <button class="close-btn" onclick="toggleModal(false)">×</button>
      <h2 class="modal-title">Attachments</h2>
      <div class="file-grid" id="fileGrid">
        <label class="add-file-btn">
          <input id = "fileInput" name = "attachment" type="file" multiple">
          +
        </label>

          ${attachment_html}

      </div>
    </div>
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

function ReturnNavbarDashboard(username){

  var profile_avatar = ReturnProfileDefaultImg(username);

  return (`
    <div class="navbar navbar--dashboard">
        <div class="logo">Task-Master</div>
        <div class="menu">
            <span id = "new_board" class = "add_task_button">+ Add Board</span>
            <span class="delete_boards">Delete Boards</span>
            <span class="board-settings-favorite-board--nav archive_boards">Archive Boards</span>
            <a href = "/"><span>Homepage</span></a>
            <span>Settings</span>
        </div>

        <div class="search-bar" id="searchboard">
            <input type="text" placeholder="Search">
        </div>

        <div class="profile-dropdown-wrapper" onclick = "toggleProfileDropdown()">
            <div class="profile profile-img-wrapper">
            ${profile_avatar}
            </div>

              <div class="profile-dropdown-modal" id="profileDropdown">
                <div class="profile-dropdown-close-btn" onclick="toggleProfileDropdown()">×</div>
                <ul class="profile-dropdown-menu">
                  <li id = "openProfile">Edit Profile</li>
                  <li>Settings</li>
                  <li>Notifications</li>
                  <a href = "/auth/logout">
                    <li >Logout</li>
                  </a>
                </ul>
              </div>
        </div>
    </div>
    `)
}

function ReturnNavbarBoard(username){

  var profile_avatar = ReturnProfileDefaultImg(username);

  return (`
    <div class="navbar">
        <div class="logo">Task-Master</div>
        <div class="menu">
            <a href = "/dashboard"><span>Dashboard</span></a>
            <span class="board-settings-favorite-board--nav">Set As Favorite</span>
            <a href = "/"><span>Homepage</span></a>
            <span>Templates</span>
        </div>

        <div class="search-bar">
            <input type="text" placeholder="Search">
        </div>

        <div class="profile-dropdown-wrapper" onclick = "toggleProfileDropdown()">
            <div class="profile profile-img-wrapper">
            ${profile_avatar}
            </div>

              <div class="profile-dropdown-modal" id="profileDropdown">
                <div class="profile-dropdown-close-btn" onclick="toggleProfileDropdown()">×</div>
                <ul class="profile-dropdown-menu">
                  <li id = "openProfile">Edit Profile</li>
                  <li>Settings</li>
                  <li>Notifications</li>
                  <a href = "/auth/logout">
                    <li >Logout</li>
                  </a>
                </ul>
              </div>
        </div>
    </div>
    `)
}
