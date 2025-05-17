function InitSearchBoardFeature() {
  const searchbar = document.querySelector("#searchboard");

  searchbar.addEventListener("input", (e) => {
    SearchBoard(e.target);
  });
}


async function SearchBoard(element) {
  let input = element.value.trim();
  if (input.length === 0) input = null;

  try {
    const { data } = await axios.post("/api/search/board", { search: input });
    const boards = data.boards;

    BuildBoardHTML(boards);
    AddBoardButtonEvents();
    if(boards.length <= 0 ){
      RenderNoBoardsFound();
    }
    if(!boards){
      alert("Error occurred");
    }
    if (data.error) {
      alert(data.error);
    }
  } catch (err) {
    console.error("Search failed:", err);
    alert("Error searching for boards.");
  }
}
