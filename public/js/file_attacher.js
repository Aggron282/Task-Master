function toggleModal(show) {
  document.getElementById('attachmentModal').classList.toggle('hidden', !show);
}

function renderFilePreview(imageSrc, fileName, fileURL) {
    const container = document.querySelector('.file-grid');

    const wrapper = document.createElement('div');
    console.log(imageSrc,fileName,fileURL)
    wrapper.className = 'file-preview';

    const img = document.createElement('img');

    img.src = imageSrc;
    img.alt = fileName;
    img.style.width = '100px';

    const name = document.createElement('p');

    name.textContent = fileName;

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
      var url = displayImage
      var attach_data = await ServeOneFileToBackend(file);
      renderFilePreview(url, file.name, fileURL);

  });

}

function ReturnType(fileType){

  if (fileType.startsWith('image/')) {
      return null
  }
  else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      displayImage = '/imgs/files/pdf.png';
  }
  else if (fileType.includes('word') || fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
      displayImage = '/imgs/files/word.png';
  }
  else if (fileType.includes('excel') || fileName.endsWith('.xls') || fileName.endsWith('.xlsx') || fileName.endsWith('.csv')) {
      displayImage = '/imgs/files/excel.png';
  }
  else if (fileType.includes('powerpoint') || fileName.endsWith('.ppt') || fileName.endsWith('.pptx')) {
      displayImage = '/imgs/files/powerpoint.png';
  }
  else if (fileType.includes('zip') || fileName.endsWith('.zip') || fileName.endsWith('.rar') || fileName.endsWith('.7z')) {
      displayImage = '/imgs/files/zip.png';
  }
  else if (fileType.includes('plain') || fileName.endsWith('.txt')) {
      displayImage = '/imgs/files/text.png';
  }
  else {
      displayImage = '/imgs/files/webp.png';
  }

  return displayImage;

}


function InitAttacher(){

    document.getElementById('fileInput').addEventListener('change', function(event) {
        const files = Array.from(event.target.files);
        PopulateFiles(files);
    });

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

  console.log(data);
}
