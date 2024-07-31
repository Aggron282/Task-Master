function RenderErrorBanner(message,color){

  var error_banner = document.querySelector(".error_banner");

  var html = `
  <div class="inner_banner" style="background:${color}" onClick = "DeleteBanner">
    <p class="error_message"> ${message} </p>
  </div>
  `
  error_banner.innerHTML = html;

  document.querySelector(".inner_banner").addEventListener("click",(e)=>{
    DeleteBanner();
  });

}

function DeleteBanner(){
  if(document.querySelector(".inner_banner")){
    var inner_banner = document.querySelector(".inner_banner");
    console.log(inner_banner)

    inner_banner.classList.add("delete_banner");
  }
}
