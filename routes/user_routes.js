const router = require("express").Router();
const controller = require("./../controllers/user_controller.js");
const isAuth = require("./../util/isAuth.js");
const { UploadImage } = require("./../controllers/upload_controller.js");

router.get("/api/user",isAuth,controller.GetUser);
router.post("/api/user/change",isAuth,UploadImage.single("image"),controller.ChangeUser);

module.exports = router;
