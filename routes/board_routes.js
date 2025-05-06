const router = require("express").Router();
const board_controller = require("./../controllers/my_board_controller.js");
const main_controller = require("./../controllers/main_controller.js");
const isAuth = require("./../util/isAuth.js");

const { UploadFile,UploadImage } = require("./../controllers/upload_controller.js");

router.get("/my_board/id=:board/name=:name",isAuth,board_controller.GetMyBoardPage);
router.post("/my_board/id=:board/name=:name/list/add",isAuth,board_controller.AddListToBoard);

router.post("/my_board/change/name",isAuth,board_controller.ChangeBoardName);
router.post("/my_board/change/background",isAuth,UploadImage.single("thumbnail"),board_controller.ChangeBoardBackground);

router.post("/api/color/all",isAuth, board_controller.ExtractColor);
router.post("/my_board/id=:board/name=:name/task/add",isAuth,board_controller.AddTaskToList);
router.post("/api/update-task",isAuth, board_controller.ChangeTasks);
// router.post("/api/archive-task",isAuth, board_controller.ArchiveTask);
router.post("/api/delete-task",isAuth, board_controller.DeleteTask);
router.post("/api/task/change/", isAuth, board_controller.ChangeTask);
router.post("/api/task/archive/", isAuth, board_controller.ArchiveTask);
router.post("/api/task/label/", isAuth, board_controller.LabelTask);
router.post("/api/task/delete/", isAuth, board_controller.DeleteTask);
router.post("/api/task/watch/", isAuth, board_controller.WatchTask);
router.get("/api/task/:board_id/:list_id/:task_id", isAuth, board_controller.GetTaskData);
router.get("/api/myboards", isAuth, board_controller.GetBoards);

router.post("/api/attachment/add/single",isAuth, UploadFile.single("attachment"), board_controller.AttachFile )
router.post("/api/attachment/delete/single",isAuth, UploadFile.single("attachment"), board_controller.DeleteOneFile )
router.post("/api/link/add/single",isAuth, board_controller.AddLink )

// router.post("/api/attachment/add/multiple",isAuth, UploadImage.multiple("file"), board_controller.AttachFiles )
router.get("/api/board/current/:id",isAuth,board_controller.GetCurrentBoard);
router.get("/api/board/all",isAuth,board_controller.GetAllBoards);

router.post("/api/move/list",isAuth,board_controller.MoveListToAnotherBoard);
router.post("/api/copy/list",isAuth,board_controller.CopyListToAnotherBoard);
router.post("/api/move/task/",isAuth,board_controller.MoveTaskToAnotherListInBoard)
router.post("/api/copy/task/",isAuth,board_controller.CopyTaskToAnotherListInBoard)

module.exports = router;
