var router = require("express").Router();
var main_controller = require("./../controllers/main_controller.js");

router.get("/",main_controller.GetHomePage);
router.get("/dashboard",main_controller.GetDashboardPage);
router.get("/auth/create_account",main_controller.GetCreateAccountPage);
router.post("/auth/create_account",main_controller.CreateAccount);
router.post("/auth/login",main_controller.Login);
router.get("/auth/login",main_controller.GetLoginPage);


module.exports = router;
