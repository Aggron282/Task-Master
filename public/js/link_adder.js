
function toggleLinkModal(show) {
  document.getElementById('linkModal').classList.toggle('hidden', !show);
}

function toggleInnerLinkModal(show) {
  const modal = document.getElementById("innerLinkModal");
  modal.classList.toggle("hidden", !show);
}

function InitLinkAdder(links = []){

    var link_wrapper = document.querySelector(".link-adder-wrapper");

    var add_link_button = document.querySelector("#linkInput");
    var submit_link_button = document.querySelector("#innerSubmitLink")

    add_link_button.addEventListener("click",(e)=>{
      
      toggleInnerLinkModal(true);
    });

    submit_link_button.addEventListener("click",(e)=>{
      console.log(e);
      SubmitLink();
    })



    link_wrapper.innerHTML = RenderLinkAdderModal(links);

}

async function SubmitLink(){

  var innerLinkName = document.querySelector("#innerLinkName");
  var innerLinkURL = document.querySelector("#innerLinkURL");

  var link_name =  innerLinkName.value;
  var link_url = innerLinkURL.value;
  var link_wrapper = document.querySelector(".link-adder-wrapper");
  var { board_id, list_id, task_id } = GetTaskData();
  var {data} = await axios.post("/api/link/add/single",{task_id:task_id, board_id:board_id, list_id:list_id, name:link_name,url:link_url});

  if(data.error){
    console.log(data.error);
    alert("Error Occured");
  }
  else if(data.links){
    toggleInnerLinkModal(false);
    toggleLinkModal(true);

    link_wrapper.innerHTML = RenderLinkAdderModal(data.links);
  }

}
