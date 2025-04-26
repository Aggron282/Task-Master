const RenderDisplayImg = (container,src) => {
  var html = `<img src =${src} class="img_display" />`
  container.innerHTML = html;
}


function RenderDisplayFileIcon(display, fileData) {
    const container = document.createElement("div");
    container.className = "file-preview";

    let iconEmoji = "📄"; // default icon
    const type = fileData.type;

    if (type.includes("pdf")) iconEmoji = "📕";
    else if (type.includes("sheet") || type.includes("excel")) iconEmoji = "📊";
    else if (type.includes("word")) iconEmoji = "📘";
    else if (type.includes("powerpoint")) iconEmoji = "📈";
    else if (type.includes("text")) iconEmoji = "📄";
    else if (type.includes("zip") || type.includes("rar")) iconEmoji = "🗜️";
    else if (type.includes("csv")) iconEmoji = "🧾";

    container.innerHTML = `
        <div class="file-icon">${iconEmoji}</div>
        <div class="file-name">${fileData.name}</div>
    `;

    display.appendChild(container);
}


const InstantImageUpload = (input, display, allowedTypes = defaultAllowedTypes, multiple = false) => {

    let [file] = input.files;

    if (!allowedTypes.includes(file.type)) {

        alert("Only image files are allowed!");
        return false;
    }

    const reader = new FileReader();

    if (multiple) {
        if (!Array.isArray(window.uploadedFiles)) {
            window.uploadedFiles = [];
        }
    } else {
        window.uploadedFiles = null;
    }

    reader.onload = (e) => {
        const imageUrl = e.target.result;

        if (!imageUrl) return false;

        const fileData = {
            name: file.name,
            size: file.size,
            type: file.type,
            url: imageUrl
        };

        if (multiple) {
            window.uploadedFiles.push(fileData);
        } else {
            window.uploadedFiles = fileData;
        }

        window.uploadedImageURL = imageUrl;
        RenderDisplayImg(display, imageUrl);
        return true;
    };

    reader.onerror = (err) => {
        console.error("Error reading file:", err);
        alert("Error in uploading!");
        return false;
    };

    reader.readAsDataURL(file);
};
