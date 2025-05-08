const router = require("express").Router();
const dashboard_controller = require("./../controllers/dashboard_controller.js");
const main_controller = require("./../controllers/main_controller.js");
const isAuth = require("./../util/isAuth.js");
const { UploadImage } = require("./../controllers/upload_controller.js");

router.post("/board/create",isAuth,UploadImage.single("thumbnail"),dashboard_controller.AddBoard);
router.post("/my_board/delete/one", isAuth, dashboard_controller.DeleteOneBoard)
router.post("/my_board/archive/one", isAuth, dashboard_controller.ArchiveOneBoard)
router.post("/my_board/copy/one", isAuth, dashboard_controller.CopyOneBoard)
router.post("/api/search/board", isAuth, dashboard_controller.SearchBoardsByName);
router.post("/my_board/favorite",isAuth,dashboard_controller.FavoriteOneBoard);
module.exports  = router;
