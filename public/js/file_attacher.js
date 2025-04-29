function toggleModal(show) {
  document.getElementById('attachmentModal').classList.toggle('hidden', !show);
}

function renderFilePreview(imageSrc, fileName, fileURL, _id) {

  const container = document.querySelector('.file-grid');

  const wrapper = document.createElement('div');

  wrapper.className = 'file-preview';
  wrapper.dataset.id = _id;

  const deleteBtn = document.createElement('p');

  deleteBtn.className = 'delete-file';
  deleteBtn.textContent = 'Delete';
  deleteBtn.dataset.id = _id;

  // deleteBtn.onclick = (e) => {
  //   DeleteOneFile(e.target.dataset.id);
  // };

  const img = document.createElement('img');

  img.src = imageSrc;
  img.alt = fileName;
  img.style.width = '100px';

  const name = document.createElement('p');
  name.textContent = fileName;

  container.appendChild(deleteBtn);
  wrapper.appendChild(img);
  wrapper.appendChild(name);

  wrapper.onclick = () => {
    window.open(fileURL, '_blank');
  };

  container.appendChild(wrapper);
}



async function PopulateFiles(files){

  if (!files.length) return;

  files.forEach(async(file) => {

      let fileType = file.type;
      let fileName = file.name.toLowerCase();
      let displayImage = '';

      const fileURL = URL.createObjectURL(file);

      displayImage = ReturnType(fileType);
      displayImage = displayImage == null ? fileURL : displayImage;
      var url = displayImage;
      console.log(file)
      var data = await ServeOneFileToBackend(file);


  });

}
function ReturnType(fileType){

  if (fileType.startsWith('image/')) {
      return null;
  }
  else if (fileType.includes('application/pdf')) {
      return '/imgs/files/pdf.png';
  }
  else if (fileType.includes('word')) {
      return '/imgs/files/word.png';
  }
  else if (fileType.includes('excel')) {
      return '/imgs/files/excel.png';
  }
  else if (fileType.includes('powerpoint')) {
      return '/imgs/files/powerpoint.png';
  }
  else if (fileType.includes('zip')) {
      return '/imgs/files/zip.png';
  }
  else if (fileType.includes('plain')) {
      return '/imgs/files/text.png';
  }
  else {
      return '/imgs/files/text.png';
  }
}


function InitAttacher(){

    document.getElementById('fileInput').addEventListener('change', function(event) {
        const files = Array.from(event.target.files);
        PopulateFiles(files);
    });
    var delete_files = document.querySelectorAll(".delete-file");
    for(var i =0; i < delete_files.length; i++){
        delete_files.addEventListener("click",(e)=>{
            var _id = e.target.dataset.id;
            DeleteOneFile(_id);
        });
    }

}

async function DeleteOneFile(e){

  var attachment_id = e.target.dataset.id;

  const formData = new FormData();

  console.log(attachment_id)

  var { board_id, list_id, task_id } = GetTaskData();

  formData.append('board_id', board_id);
  formData.append('list_id', list_id);
  formData.append('task_id', task_id);
  formData.append('attachment_id', attachment_id);

  const { data } = await axios.post("/api/attachment/delete/single", formData);

  console.log(data);
}

async function ServeOneFileToBackend(file) {
  const formData = new FormData();

  var { board_id, list_id, task_id } = GetTaskData();

  formData.append('attachment', file);
  formData.append('board_id', board_id);
  formData.append('list_id', list_id);
  formData.append('task_id', task_id);

  const { data } = await axios.post("/api/attachment/add/single", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  console.log(data.attachment)
  var attachment_holder = document.querySelector(".file-grid");
  // var attacher_wrapper  = document.querySelector(".attacher-wrapper");
  var {originalname,filename,mimetype,_id} = data.attachment;
  attachment_holder.innerHTML += ReturnFilePreviewHTML(originalname, filename, mimetype,_id);

}
