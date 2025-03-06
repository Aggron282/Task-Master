let originalListId = null;
var archive_delete_container = document.querySelector(".archive_board")

var archive_container = document.querySelector(".archive--container--archive");
var delete_container = document.querySelector(".archive--container--delete");

function ToggleArchive(isOn){

  if(isOn){
    archive_delete_container.classList.add("archive_board--active");
  }
  else{
    archive_delete_container.classList.remove("archive_board--active");
  }

}

function EnableDragDrop() {

    const taskLists = document.querySelectorAll('.task_list');
    const taskItems = document.querySelectorAll('.task_item_container');

    let draggedTask = null;
    let originalList = null;

    function addDragListeners(task) {
        task.setAttribute('draggable', 'true');

        task.addEventListener('dragstart', (e) => {

            draggedTask = task;

            originalList = task.parentElement;
            originalListId = task.dataset.listId;

            ToggleArchive(true)

            e.dataTransfer.setData('text/plain', task.dataset.id);

            setTimeout(() => task.style.display = "none", 0);

        });

        task.addEventListener('dragend', () => {

            if (draggedTask) {
                draggedTask.style.display = "block";
            }

            if (!draggedTask.parentElement || !draggedTask.parentElement.classList.contains('task_list')) {
                originalList.appendChild(draggedTask);
            }

            // ToggleArchive(false)

        });
    }

    taskItems.forEach(addDragListeners);

    taskLists.forEach((list) => {

        list.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        archive_container.addEventListener("drop",async (e)=>{

          e.preventDefault();
          console.log(archive_container)
          if(draggedTask){

            const newListId = list.dataset.listId;
            const listContainer = list.querySelector(".all_tasks_in_list");
            const taskId = draggedTask.dataset.taskId;
            const url = window.location.href;
            const boardId = url.split("id=:")[1]?.split("/")[0];

            draggedTask.style.display = "block";
            draggedTask.dataset.listId = newListId;

            try {
                await axios.post('/api/archive-task', {
                    taskId: draggedTask.dataset.taskId,
                    boardId: boardId,
                    originalListId: originalListId,
                });

                // listContainer.appendChild(draggedTask);
                draggedTask.style.display = "block";
                draggedTask.dataset.listId = newListId;

                originalListId = null;
                draggedTask = null;

            }
            catch (error) {
                // ToggleArchive(false)
                console.error('Error updating task:', error);
            }

        }

      });

        delete_container.addEventListener("drop",async (e)=>{

        e.preventDefault();

        if(draggedTask){

          const newListId = list.dataset.listId;
          const listContainer = list.querySelector(".all_tasks_in_list");
          const taskId = draggedTask.dataset.taskId;
          const url = window.location.href;
          const boardId = url.split("id=:")[1]?.split("/")[0];

          draggedTask.style.display = "block";
          draggedTask.dataset.listId = newListId;

          try {
              await axios.post('/api/delete-task', {
                  taskId: draggedTask.dataset.taskId,
                  boardId: boardId,
                  originalListId: originalListId,
              });

              // listContainer.appendChild(draggedTask);
              draggedTask.style.display = "block";
              draggedTask.dataset.listId = newListId;

              originalListId = null;
              draggedTask = null;

          }
          catch (error) {
              // ToggleArchive(false)
              console.error('Error updating task:', error);
          }

      }

    });

        list.addEventListener('drop', async (e) => {

            e.preventDefault();

            if (draggedTask) {

                const newListId = list.dataset.listId;
                const listContainer = list.querySelector(".all_tasks_in_list");

                const url = window.location.href;
                const boardId = url.split("id=:")[1]?.split("/")[0];

                try {
                    await axios.post('/api/update-task', {
                        taskId: draggedTask.dataset.taskId,
                        newListId: newListId,
                        boardId: boardId,
                        originalListId: originalListId,
                    });

                    listContainer.appendChild(draggedTask);
                    draggedTask.style.display = "block";
                    draggedTask.dataset.listId = newListId;

                    originalListId = null;
                    draggedTask = null;

                }
                catch (error) {
                    ToggleArchive(false)
                    console.error('Error updating task:', error);
                }

            }

        });

    });

}
