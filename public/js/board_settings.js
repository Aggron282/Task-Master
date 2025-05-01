var boardSettings = document.querySelector(".menu-item--settings");
var closeBoardSettings = document.querySelector(".board-settings-close");
var boardModal = document.querySelector(".board-settings-modal");
var changeBackgroundBoard = document.querySelector(".board-settings-background");
var bgColorPicker = document.querySelector("#bgColorPicker");
var backgroundModal = document.querySelector(".backgroundModal");
var submitBackgroundChange = document.querySelector(".bgModal-submit-btn");

function ToggleBoardSettings(isOn){

  if(isOn){
    boardModal.classList.remove("hidden");
  }
  else{
    boardModal.classList.add("hidden");
  }

}

boardSettings.addEventListener("click",(e)=>{
    ToggleBoardSettings(true)
});

closeBoardSettings.addEventListener("click",(e)=>{
    ChangeBoardName();
    ToggleBoardSettings(false)
});

changeBackgroundBoard.addEventListener("click",(e)=>{
  e.preventDefault();
  toggleBackgroundModal();
});

bgColorPicker.addEventListener("change",(e)=>{
  BackgroundPreview(e.target.value);
});

submitBackgroundChange.addEventListener("click",(e)=>{
    e.preventDefault();
    ChangeBoardColor();
    toggleBackgroundModal();
})

function toggleProfileDropdown() {
  const modal = document.getElementById("profileDropdown");
  modal.classList.toggle("active");
}

function toggleBackgroundModal() {
    const modal = document.querySelector('.changeBackgroundWrapper');
    modal.classList.toggle('hidden');
}

async function ChangeBoardName(){
    const url = window.location.href;

    const board_name = url.split("name=:")[1];

    var taskboard_name = document.querySelector("#boardtitle");

    let id = url.split("id=:")[1];
    id = id.split("/")[0];

    var input = document.querySelector("#boardnameform");
    var name = input.value;
    if(input.value.length < 1 || input.value == board_name){
      return;
    }
    var {data} = await axios.post(`/my_board/change/name`,{name:name,board_id:id,board_name:board_name});

    if(data.error == null){
      alert("Successfully Changed Board!");
    }
    else{
      alert("Error in Changing Board!");
    }

    console.log(taskboard_name)
    input.value = name;
    taskboard_name.innerHTML = name;

}

function ChangeBoardColor(){

  var form = document.querySelector("#changeBackgroundBoard");
  var form_data = new FormData(form);
  const url = window.location.href;

  let id = url.split("id=:")[1];
  id = id.split("/")[0];

  // var taskboard_name = document.querySelector("#taskboardname");
  var taskboard = document.querySelector("#taskboard");
  form_data.append("board_id",id);

  console.log(id)

  axios.post("/my_board/change/background", form_data).then(({data}) => {
    console.log(data)
    if(data.error){
      console.log(data.error);
      return;
    }

    var background = data.background;
    var isImage = CheckIfColorOrImage(background);
    console.log(background)
    if(isImage){
      document.body.style.background = `url("/images/${background}")`;
    }
    else{
      document.body.style.background = data.background;
    }
    alert("Board Background Changed!")
  }).catch(error => {
    console.error("Error creating board:", error);
  });

}

function BackgroundPreview(background){

    backgroundModal.style.background = background;

    var contrast = getRandomColorWithContrast(background);

    var labels = backgroundModal.querySelectorAll("label");
    var h1 = backgroundModal.querySelectorAll("h1");
    var button= backgroundModal.querySelector("button");

    for(var i =0; i < labels.length;i++){
      var label = labels[i];
      label.style.color = contrast.background;
    }

    for(var i =0; i < h1.length;i++){
      var h1_  = h1[i];
      h1_.style.color = contrast.background;
    }

    button.style.background = contrast.background;
    button.style.color = contrast.text;

}

function ChangeBoardBackground(background){

  var isImage = CheckIfColorOrImage(background);
  // var taskboard = document.querySelector("#taskboard");
  // conssol
  if(isImage){
    document.body.style.background = `url("/images/${background}")`
  }
  else{
    document.body.style.background = background;
  }

}

function CheckIfColorOrImage(background){

  const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp', 'image/tiff'];
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff'];

  if (typeof background !== 'string') {
    return false;
  }

  const lowerbackground = background.toLowerCase();

  if (lowerbackground.includes('/')) {
    return imageMimeTypes.includes(lowerbackground);
  }

  return imageExtensions.some(ext => lowerbackground.endsWith(ext));

}

function PopulateNameInSettings(name) {

  var board_name =   document.querySelector("#boardnameform");
  board_name.value = name;

}
