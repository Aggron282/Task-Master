const router = require("express").Router();
const board_controller = require("./../controllers/my_board_controller.js");
const main_controller = require("./../controllers/main_controller.js");
const isAuth = require("./../util/isAuth.js");

router.get("/my_board/id=:board/name=:name",isAuth,board_controller.GetMyBoardPage);
router.post("/my_board/id=:board/name=:name/list/add",isAuth,board_controller.AddListToBoard);
router.post("/api/color/all",isAuth, board_controller.ExtractColor);
router.post("/my_board/id=:board/name=:name/task/add",isAuth,board_controller.AddTaskToList);



module.exports = router;
