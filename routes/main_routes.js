var router = require("express").Router();
var main_controller = require("./../controllers/main_controller.js");
const isAuth = require("./../util/isAuth.js");

router.get("/",main_controller.GetHomePage);
router.get("/dashboard",isAuth,main_controller.GetDashboardPage);
router.get("/auth/create_account",main_controller.GetCreateAccountPage);
router.post("/auth/create_account",main_controller.CreateAccount);
router.post("/auth/login",main_controller.Login);
router.get("/auth/login",main_controller.GetLoginPage);
router.get("/auth/logout",isAuth,main_controller.Logout);

module.exports = router;
