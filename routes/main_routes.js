const router = require("express").Router();
const main_controller = require("./../controllers/main_controller.js");
const isAuth = require("./../util/isAuth.js");

router.get("/",main_controller.GetHomePage);
router.get("/dashboard",isAuth,main_controller.GetDashboardPage);
router.get("/user/data",isAuth,main_controller.GetUserData);


module.exports = router;
