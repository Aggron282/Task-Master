var router = require("express").Router();
var board_controller = require("./../controllers/board_controller.js");


router.post("/board/create",board_controller.AddBoard);



module.exports = router;
