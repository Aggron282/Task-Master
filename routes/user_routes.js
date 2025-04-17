const router = require("express").Router();
const controller = require("./../controllers/user_controller.js");
const isAuth = require("./../util/isAuth.js");

router.get("/api/user",isAuth,controller.GetUser);
router.post("/api/user/change",isAuth,controller.ChangeUser);

module.exports = router;
