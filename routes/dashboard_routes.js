const router = require("express").Router();
const dashboard_controller = require("./../controllers/dashboard_controller.js");
const main_controller = require("./../controllers/main_controller.js");
const isAuth = require("./../util/isAuth.js");

router.post("/board/create",isAuth,dashboard_controller.AddBoard);
router.post("/my_board/delete/one", isAuth, dashboard_controller.DeleteOneBoard)

module.exports  = router;
