var router = require("express").Router();
var board_controller = require("./../controllers/board_controller.js");
var main_controller = require("./../controllers/main_controller.js");
var isAuth = require("./../util/isAuth.js");

router.post("/board/create",isAuth,board_controller.AddBoard);
router.get("/user/data",isAuth,main_controller.GetUserData);
router.get("/my_board/id=:board/name=:name",isAuth,board_controller.GetMyBoardPage);
router.post("/my_board/create/id=:board/name=:name",isAuth,board_controller.AddTaskList);
router.post("/my_board/add/task",isAuth,board_controller.AddTaskToList);


module.exports = router;
