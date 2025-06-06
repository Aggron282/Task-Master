
const GenerateOtherBoards = async () =>{
  var holder = document.querySelector(".board-holder");

  const url = window.location.href;
  const name = url.split("name=:")[1];
  holder.innerHTML = "";
  let id = url.split("id=:")[1];

  var {data} = await axios.get("/api/myboards");

  var boards = data.boards;
  var html = ``;

  for(var i =0; i < boards.length; i ++ ){
    
    var board = boards[i];
    var isImage = board.background_img && typeof board.background_img === "string";
    var background = isImage ? `url("/images/${board.background_img}")` : board.background;
    var rgb = isImage ? board.background_img : board.background;
    var no_space_name = board.name.replace(/\s/g, '');
    var anchor = document.createElement("a");
    anchor.setAttribute("href",`http://localhost:3001/my_board/id=:${board._id}/name=:${no_space_name}`)
    var boardDisplay = document.createElement("div");
    boardDisplay.classList.add("board-display");

    var icon = document.createElement("div");
    icon.classList.add("icon");
    icon.style.background = background;

    var paragraph = document.createElement("p");
    paragraph.classList.add("board-preview-text")
    paragraph.textContent = board.name;

    boardDisplay.appendChild(icon);
    boardDisplay.appendChild(paragraph);

    anchor.appendChild(boardDisplay);
    holder.appendChild(anchor);
  }

}

 GenerateOtherBoards();
