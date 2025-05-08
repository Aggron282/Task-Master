 function InitSearchBoardFeature(){

  var searchbar = document.querySelector("#searchboard");

  searchbar.addEventListener("change", (e)=>{
    SearchBoard(e.target);
  });

}


async function SearchBoard(element){
    var input = element.value.length > 0 ? element.value : null;
    console.log(input)
    var {data} = await axios.post("/api/search/board", {search: input});
      var boards = data.boards;
    if(!data.error){

      console.log(boards);
      BuildBoardHTML(boards);
      AddBoardButtonEvents();
    }else{
      alert("No Boards Found!");

      BuildBoardHTML(boards);
      AddBoardButtonEvents();
    }
}
