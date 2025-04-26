var boardSettings = document.querySelector(".menu-item--settings");
var closeBoardSettings = document.querySelector(".board-settings-close");
var boardModal = document.querySelector(".board-settings-modal");

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
    ToggleBoardSettings(false)
})

function toggleProfileDropdown() {
  const modal = document.getElementById("profileDropdown");
  modal.classList.toggle("active");
}
