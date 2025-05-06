
function toggleLinkModal(show) {
  document.getElementById('linkModal').classList.toggle('hidden', !show);
}

function toggleInnerLinkModal(show) {
  const modal = document.getElementById("innerLinkModal");
  console.log(modal,show)
  modal.classList.toggle("hidden", !show);
}
function InitLinkAdder(links = []) {
  var link_wrapper = document.querySelector(".link-adder-wrapper");

  // Render HTML first
  link_wrapper.innerHTML = RenderLinkAdderModal(links);

  // THEN attach event listeners
  var add_link_button = document.querySelector("#linkInput");
  var submit_link_button = document.querySelector("#innerSubmitLink");

  console.log("Add Link Button:", add_link_button);

  if (add_link_button) {
    add_link_button.addEventListener("click", (e) => {
      console.log("Clicked linkInput", e);
      toggleInnerLinkModal(true);
    });
  }

  if (submit_link_button) {
    submit_link_button.addEventListener("click", (e) => {
      console.log("Clicked innerSubmitLink", e);
      SubmitLink();
    });
  }
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
