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

const ReturnLabelModal = (task_id) => {

  return (
    `
    <div id="label-modal" class="label-modal" data-task-id="${task_id}">
      <p class="exit-label-modal exit">X</p> <!-- FIXED: closed <p> tag properly -->

      <div class="label-modal-content">
        <h2 class="label-modal-title">Labels</h2>

        <div class="label-modal-list">
          <div class="label-modal-item" data-color ="#2e7d32" data-is-active = "0" data-label-type="0" style="--label-color: #2e7d32;">Warning</div>
          <div class="label-modal-item" data-color ="#f9a825" data-is-active = "0" data-label-type="1" style="--label-color: #f9a825;">Urgent</div>
          <div class="label-modal-item" data-color ="#ef6c00" data-is-active = "0" data-label-type="3" style="--label-color: #ef6c00;">Low Priority</div>
          <div class="label-modal-item" data-color ="#d32f2f" data-is-active = "0" data-label-type="2" style="--label-color: #d32f2f;">High Priority</div>
          <div class="label-modal-item" data-color ="#7e57c2" data-is-active = "0" data-label-type="10" style="--label-color: #7e57c2;">Habit</div>
          <div class="label-modal-item" data-color ="#1976d2" data-is-active = "0" data-label-type="-1" style="--label-color: #1976d2;">Incomplete</div>
        </div>

        <button class="label-modal-btn">New Feature Coming Soon</button>
      </div>
    </div>


    `
  );

}

const ReturnBoardMoveItem  = (board) =>{
  var isImg = board.background_img != null ? true :false;

  if(isImg){
    return (
      `
      <div class="board-move-item" board_id = "${board._id}">
        <img src = "/images/${board.background_img.filename}" class="board-preview"/>
        <p class="title">
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
      <div class= "list-move-item board-move-item ">
        <p class="title">
          ${list.name}
        </p>
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

  var board_html = "";
  console.log(board);
  for(var i=0; i < board.list.length; i++){
    board_html += ReturnListMoveItem(board.list[i]);
  }

  return (`
    <div class="move-wrapper move-list-wrapper hidden" data-type = "0">
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
  var list_of_tasks = RenderTaskItems(task_list.list,task_list._id, showAll, showArchiveOnly,showWatched);

  return(`
    <div class=" task_list relative" _id = "${task_list._id}" data-list-id = "${task_list._id}" isClicked = "0">


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

const ReturnProfileModal = (user_id) => {
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
          <input type="text"  class="profile-input" id="name" placeholder="Your name"  name = "name"/>
          <svg class="profile-pencil-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2.146-2.146 1.043-1.043a.5.5 0 0 1 .707 0l1.439 1.439zm-1.75 2.456L6 12.147V14h1.854l7.752-7.752-1.854-1.853z"/>
          </svg>
        </div>
      </div>

      <div class="profile-input-group">
        <label for="username">Username</label>
        <div class="profile-input-wrap">
          <input type="text" id="username"  class="profile-input" placeholder="marcomac" name = "username"/>
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
                        <textarea class="description_box" id="task-description" name="description" rows="3" cols="3">${task.description}</textarea>
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

                      <div class="option-card">
                          <img class="o-img"  src = "/imgs/options/3.png"/>
                          <p class="title">Current Members</p>
                      </div>

                      <div class="option-card">
                          <img class="o-img"  src = "/imgs/options/9.png"/>
                          <p class="title">Move</p>
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

      ${RenderFileAdderModal(task.attachments)}

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
    html += RenderListItem(board.list[k],showAll,showArchiveOnly,showWatched);
  }

  return html;

}

function RenderTaskItems(tasks,list_id,showAll = false, showArchiveOnly = false, showWatched = false){

  var html = ``;

  console.log(tasks)
  return
  tasks.map((task)=>{

    var extra = "";

    var name = task.name;
    var description_html = task.description.length > 0 ? menu_icon : "";
    var deadline_html = task.deadline.length > 0 ? deadline_icon : "";
    var watch_html = task.watching ? watch_icon : "";

    let should_show = false;
    const isArchived = task.isArchived === true;
    const isWatched = task.watching === true;
    console.log(task.watching)
     if (showAll) {
       should_show = true;
     } else if (showArchiveOnly) {
       should_show = isArchived;
     } else if(showWatched) {
       should_show = isWatched;
     }else{
       should_show = !isArchived;
     }

    if(should_show){
      html += `

      <div class="task_item_container" _id = ${task._id} data-task-id = ${task._id}  data-list-id = "${list_id}" status = ${task.status}>

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

function retureFilePreviewHTML(imageSrc, fileName, fileURL) {
    const html = `
      <div class="file-preview" onclick="window.open('${fileURL}', '_blank')">
        <img src="${imageSrc}" alt="${fileName}" style="width: 100px;">
        <p>${fileName}</p>
      </div>
    `;

    return html;


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


function ReturnFilePreviewHTML(originalName, fileName, mimeType) {

    var displayImage = ReturnType(mimeType);
    displayImage = displayImage == null ? "/files/"+fileName : displayImage;
    const html = `
      <div class="file-preview" onclick="window.open('/files/${fileName}', '_blank')">
        <img src="${displayImage}" alt="${displayImage}" style="width: 100px;">
        <p>${originalName}</p>
      </div>
    `;

    return html;

}

 function RenderFileAdderModal(attachments = []){

  var attachment_html = ``;
  console.log(attachments)

  for(var i =0; i < attachments.length;i++ ){
    var {originalname, filename, mimetype} = attachments[i];

    attachment_html += ReturnFilePreviewHTML(originalname,filename,mimetype);
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

function ReturnNavbarDashboard(){
  return(
    `
    <div class="navbar navbar--board">

        <div class="row navbar_board_row">

          <div class="col-2 logo_col">
            <div class="logo_container--dashboard">
                <img class="logo" src = "/imgs/logo.png"/>
                <p class="title title--logo"> Task-Master </p>
            </div>
          </div>

          <div class="col-5 choices_col">

            <div class="choice_group_container">

              <div class="choice_container">
                <div class="dropdown_container">
                    <p >Preferences</p>
                    <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"
                    fill-rule="evenodd" clip-rule="evenodd"><path d="M11 21.883l-6.235-7.527-.765.644 7.521 9 7.479-9-.764-.645-6.236 7.529v-21.884h-1v21.883z"/></svg>
                </div>
              </div>

              <div class="choice_container">
                <div class="dropdown_container">
                    <p >Recent</p>
                    <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"
                    fill-rule="evenodd" clip-rule="evenodd"><path d="M11 21.883l-6.235-7.527-.765.644 7.521 9 7.479-9-.764-.645-6.236 7.529v-21.884h-1v21.883z"/></svg>
                </div>
              </div>

              <div class="choice_container choice_container--fav">

                <div class="dropdown_container">
                    <p >Favorites</p>
                    <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"
                    fill-rule="evenodd" clip-rule="evenodd"><path d="M11 21.883l-6.235-7.527-.765.644 7.521 9 7.479-9-.764-.645-6.236 7.529v-21.884h-1v21.883z"/></svg>
                </div>

              </div>

            </div>

            </div>

          <div class="col-3 board_search_col">
            <form>
               <input class="board_search" placeholder = "Search for your boards">
            </form>
          </div>

          <div class="col-2 profile_col">

            <div class="choice_container choice_container--profile">

              <div class="profile-dropdown-wrapper" onclick = "toggleProfileDropdown()">

                  <div class="profile-img-wrapper">

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

          </div>

        </div>

    </div>
    `
  )
}
function ReturnNavbarBoard(username){

  var profile_avatar = ReturnProfileDefaultImg(username);

  return (`
    <div class="navbar">
        <div class="logo">Task-Master</div>
        <div class="menu">
            <span>Workspaces</span>
            <span>Recent</span>
            <span>Starred</span>
            <span>Templates</span>
        </div>
        <button class="create-btn">Create</button>
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
