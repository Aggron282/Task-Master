function toggleProfileDropdown() {
  const modal = document.getElementById("profileDropdown");
  modal.classList.toggle("active");
}

const InitProfile = async (container,wrapper) => {

  var {data} = await axios.get("/api/user");

  var {username,decryptPassword,profilePicture,name} = data.profile;

  container.innerHTML += ReturnProfileModal(null,name,username,decryptPassword);

  var profile_holders = document.querySelectorAll(".profile-img-wrapper")
  console.log(profilePicture)
  for(var i = 0; i < profile_holders.length; i++){

    PopulateProfileImg(profile_holders[i],profilePicture,null);
  }

  var username_input = document.querySelector(".profile-input[name='username']")
  var password_input = document.querySelector(".profile-input[name='password']")
  var name_input = document.querySelector(".profile-input[name='name']")
  var confirm_input = document.querySelector(".profile-input[name='confirm']")

  password_input.addEventListener("change",(e)=>{

    var confirm_input = document.querySelector(".profile-input[name='confirm']");
    console.log(confirm_input)
    confirm_input.value = "";

  });

  ToggleProfileModal(false);

  var exit_profile = document.querySelector(".profile-close-btn");
  var save_profile = document.querySelector(".profile-save-btn");
  var open_profile = document.querySelector("#openProfile");
  var delete_account = document.querySelector(".profile-delete-btn");
  var upload_button = document .querySelector(".upload");
  var profile_wrapper = document.querySelector(".profile-img-wrapper");

  upload_button.addEventListener("change",async (e)=>{
    InstantImageUpload(upload_button,profile_wrapper,imageTypesAllowed,false);
  });

  open_profile.addEventListener("click",(e)=>{
    ToggleProfileModal(true);
  });

  exit_profile.addEventListener("click",(e)=>{
    ToggleProfileModal(false);
  });

  save_profile.addEventListener("click",(e)=>{
    SaveChanges();
  });

  delete_account.addEventListener("click",(e)=>{
    DeleteAccount();
  });

  function ToggleProfileModal(isOn){

      if(isOn){
        wrapper.classList.add("hidden");
        container.classList.remove("hidden");
      }
      else{
        wrapper.classList.remove("hidden");
        container.classList.add("hidden");
      }

  }

}

async function PopulateProfileMenu(){

  try{
    var {data} = await axios.get("/api/user");

    var {username,decryptPassword,profileImg,name} = data.profile;

    var username_input = document.querySelector(".profile-input[name='username']")
    var password_input = document.querySelector(".profile-input[name='password']")
    var name_input = document.querySelector(".profile-input[name='name']")
    var confirm_input = document.querySelector(".profile-input[name='confirm']")

    password_input.addEventListener("change",(e)=>{

      var confirm_input = document.querySelector(".profile-input[name='confirm']");
      confirm_input.value = "";

    });

    name_input.value = name;
    username_input.value = username;
    password_input.value = decryptPassword;
    confirm_input.value = decryptPassword;

  }catch(error){
    console.log(error);
  }

}

async function SaveChanges() {

  var username_input = document.querySelector(".profile-input[name='username']");
  var name_input = document.querySelector(".profile-input[name='name']");
  var upload_button = document.querySelector(".upload");
  var confirm_input = document.querySelector(".profile-input[name='confirm']");
  var password_input = document.querySelector(".profile-input[name='password']");

  var name = name_input.value;
  var password = password_input.value;
  var confirm = confirm_input.value;
  var username = username_input.value;

  if (username.length < 4){
    alert("Your username is too short! Must be more than 4 Characters");
    return;
  }
  if (password.length < 4){
    alert("Your password is too short! Must be more than 4 Characters");
    return;
  }
  if (confirm != password) {
    alert("Your passwords don't match!");
    return;
  }

  var formData = new FormData();

  formData.append("username", username);
  formData.append("name", name);
  formData.append("password", password);
  // formData.append("name", name);

  if (upload_button.files.length > 0) {
    formData.append("image", upload_button.files[0]);
  }

  try {

    var { data } = await axios.post("/api/user/change", formData);
    console.log(data);
    if (data.error == null) {
      alert("Profile Changed!");
      window.location.reload();
    }
    else {
      alert("Something went wrong!");
    }

    var {profilePicture} = data.profile;
    var profile_holders = document.querySelectorAll(".profile-img-wrapper")

    for(var i = 0; i < profile_holders.length; i++){
      PopulateProfileImg(profile_holders[i],profilePicture,null);
    }

  } catch (error) {
    console.log(error);
    alert("Error saving profile changes.");
  }

}

function PopulateProfileImg(profileImg, src,name){

    if(src){
      profileImg.innerHTML = `
      <img class="profile_img" src = "/images/${src}"/>
      `
    }else{

      var profile_name = name ? name : "P";
      var initials = profile_name.substring(0, 3);
      var {text,background} = getRandomColorWithContrast();

      profileImg.innerHTML = `
      <div class="profile-avatar" style="background:${background}">
          <p style = "color:${text}">${initials}</p>
      </div>
      `
    }

}

async function DeleteAccount() {

  try {
    const deletePrompt = window.prompt(
      "Type DELETE to permanently delete your account. This action cannot be undone."
    );

    if (deletePrompt === "DELETE") {

      const { data } = await axios.post("/auth/delete");

      alert("Your account has been deleted.");

      window.location.assign("/")
    }
    else {
      alert("Input does not match. Account not deleted.");
    }
  }
  catch (error) {
    console.error("Error deleting account:", error);
    alert("An error occurred while trying to delete your account.");
  }

}
