const login_button = document.querySelector(".login_button");
const login_form = document.querySelector(".login_form");
const password = document.querySelector("#password");
const username = document.querySelector("#username");
const name = document.querySelector("#name");

login_form.addEventListener("submit",(e)=>{
  e.preventDefault();
  CreateAccount();
})

login_button.addEventListener("click",(e)=>{
  e.preventDefault();
  CreateAccount();
})

function CreateAccount(){

  var account = {
    username: username.value,
    password: password.value,
    name: name.value
  }

  if(account.password.length < 4){
    RenderErrorBanner("Password is too short","orangered");
    return;
  }
  else{

    axios.post("/auth/create_account",{account:account}).then(async (result)=>{

      if(result.data){

        var data = result.data;

        if(data.error){
          RenderErrorBanner(data.error,"limegreen");
        }
        else{
          window.location.assign("/dashboard");
        }

      }

    });

  }

}
