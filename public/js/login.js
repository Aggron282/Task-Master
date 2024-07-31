var submit_button = document.querySelector(".login_button");
var submit_form =  document.querySelector(".login_form_action");

function Login(){

  var username = document.querySelector("#username");
  var password = document.querySelector("#password");

  axios.post("/auth/login",{username:username.value,password:password.value}).then((result)=>{

    var data = result.data;

    if(data.error){
      RenderErrorBanner(data.error, "orangered");
    }
    else{
      window.location.assign("/dashboard");
    }

  });

}

submit_button.addEventListener("click",(e)=>{
  e.preventDefault();
  Login();
})

submit_form.addEventListener("submit",(e)=>{
  e.preventDefault();
  Login();
})
