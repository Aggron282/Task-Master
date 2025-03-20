const router = require("express").Router();
const board_controller = require("./../controllers/my_board_controller.js");
const main_controller = require("./../controllers/main_controller.js");
const isAuth = require("./../util/isAuth.js");

router.get("/my_board/id=:board/name=:name",isAuth,board_controller.GetMyBoardPage);
router.post("/my_board/id=:board/name=:name/list/add",isAuth,board_controller.AddListToBoard);
router.post("/api/color/all",isAuth, board_controller.ExtractColor);
router.post("/my_board/id=:board/name=:name/task/add",isAuth,board_controller.AddTaskToList);
router.post("/api/update-task",isAuth, board_controller.ChangeTasks);
// router.post("/api/archive-task",isAuth, board_controller.ArchiveTask);
router.post("/api/delete-task",isAuth, board_controller.DeleteTask);
router.post("/api/task/change/", isAuth, board_controller.ChangeTask);
router.post("/api/task/archive/", isAuth, board_controller.ArchiveTask);
router.post("/api/task/delete/", isAuth, board_controller.DeleteTask);
router.post("/api/task/watch/", isAuth, board_controller.WatchTask);
router.get("/api/task/:board_id/:list_id/:task_id", isAuth, board_controller.GetTaskData);

module.exports = router;
