var router = require("express").Router();
var board_controller = require("./../controllers/board_controller.js");
var main_controller = require("./../controllers/main_controller.js");


router.post("/board/create",board_controller.AddBoard);
router.get("/user/data",main_controller.GetUserData);
router.get("/my_board/id=:board/name=:name",board_controller.GetMyBoardPage);



module.exports = router;
