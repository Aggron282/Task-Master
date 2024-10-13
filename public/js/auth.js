function RenderErrorBanner(message,color){

  var error_banner = document.querySelector(".error_banner");

  var html = RenderErrorBannerElement(message,color);
  error_banner.innerHTML = html;

  document.querySelector(".inner_banner").addEventListener("click",(e)=>{
    DeleteBanner();
  });

}

function DeleteBanner(){

  if(document.querySelector(".inner_banner")){
    var inner_banner = document.querySelector(".inner_banner");
    inner_banner.classList.add("delete_banner");
  }

}
