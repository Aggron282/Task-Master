let originalListId = null;
let draggedTask = null;
let originalList = null;

const archive_delete_container = document.querySelector(".archive_board");
const archive_container = document.querySelector(".archive--container--archive");
const delete_container = document.querySelector(".archive--container--delete");

function ToggleArchive(isOn) {
  archive_delete_container.classList.toggle("archive_board--active", isOn);
}

function EnableDragDrop() {
  const taskLists = document.querySelectorAll('.task_list');
  const taskItems = document.querySelectorAll('.task_item_container');

  taskItems.forEach(addDragListeners);

  taskLists.forEach((list) => {
    list.addEventListener('dragover', (e) => e.preventDefault());

    list.addEventListener('drop', async (e) => {
    e.preventDefault();
    if (!draggedTask) return;

    const newListId = list.dataset.listId;
    const listContainer = list.querySelector(".all_tasks_in_list") || list;
    const boardId = window.location.href.split("id=:")[1]?.split("/")[0];

    // 🔐 Store data BEFORE removing the DOM element
    const taskId = draggedTask.dataset.taskId;
    draggedTask.style.display = "block";

    // 🧠 Clone task AND ensure it has unique identity + listeners
    const newTask = draggedTask.cloneNode(true);
    newTask.dataset.dragInit = "false";  // Allow reinit
    newTask.setAttribute("draggable", "true"); // In case it's lost
    addDragListeners(newTask);

    // 🗑 Remove the original dragged DOM element
    draggedTask.remove();

    try {
      await axios.post('/api/update-task', {
        task_id: taskId,
        new_list_id: newListId,
        board_id: boardId,
        original_list_id: originalListId,
      });

      newTask.dataset.listId = newListId;
      addDragListeners(newTask);
      listContainer.appendChild(newTask);
    } catch (error) {
      console.error('Error updating task:', error);
      // 🛑 Re-append original task on error
      originalList.appendChild(draggedTask);
    } finally {
      draggedTask = null;
      originalListId = null;
    }
  });

  });

  // Archive + Delete containers
  [archive_container, delete_container].forEach(container => {
    container.addEventListener('dragover', e => e.preventDefault());
  });

  archive_container.addEventListener('dragleave', (e) => {
    e.preventDefault();
    archive_container.classList.remove('archive-container-hover');
  });

  archive_container.addEventListener("drop", Archive);
  delete_container.addEventListener("drop", Delete);
}

async function Archive(e) {
  e.preventDefault();
  if (!draggedTask) return;

  const boardId = window.location.href.split("id=:")[1]?.split("/")[0];

  try {
    await axios.post('/api/task/archive/', {
      task_id: draggedTask.dataset.taskId,
      board_id: boardId,
      list_id: originalListId,
    });

    draggedTask.remove();
  } catch (error) {
    console.error('Error archiving task:', error);
  } finally {
    draggedTask = null;
    originalListId = null;
  }
}

async function Delete(e) {
  e.preventDefault();
  if (!draggedTask) return;

  const boardId = window.location.href.split("id=:")[1]?.split("/")[0];

  try {
    await axios.post("/api/task/delete/", {
      task_id: draggedTask.dataset.taskId,
      board_id: boardId,
      list_id: originalListId,
    });

    draggedTask.remove();
  } catch (error) {
    console.error('Error deleting task:', error);
  } finally {
    draggedTask = null;
    originalListId = null;
  }
}

function addDragListeners(task) {
  if (task.dataset.dragInit === "true") return;

  task.dataset.dragInit = "true";
  task.setAttribute('draggable', 'true');

  task.addEventListener('dragstart', (e) => {
    draggedTask = task;
    originalList = task.parentElement;
    originalListId = task.dataset.listId;

    ToggleArchive(true);
    e.dataTransfer.setData('text/plain', task.dataset.taskId);
    setTimeout(() => task.style.display = "none", 0);
  });

  task.addEventListener('dragend', () => {
    if (draggedTask) {
      draggedTask.style.display = "block";
    }

    setTimeout(() => {
      if (!draggedTask) return;

      // ✅ Only attempt to re-append if parentElement still exists
      if (draggedTask.parentElement && !draggedTask.parentElement.contains(draggedTask)) {
        originalList.appendChild(draggedTask);
      }

      ToggleArchive(false);
      draggedTask = null;
      originalList = null;
      originalListId = null;
    }, 10);
  });
}

// ✅ Call drag/drop initializer when DOM is ready
document.addEventListener("DOMContentLoaded", EnableDragDrop);
