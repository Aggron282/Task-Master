const router = require("express").Router();
const auth_controller = require("./../controllers/auth_controller.js");
const isAuth = require("./../util/isAuth.js");

router.get("/auth/create_account",auth_controller.GetCreateAccountPage);
router.post("/auth/create_account",auth_controller.CreateAccount);
router.post("/auth/login",auth_controller.Login);
router.get("/auth/login",auth_controller.GetLoginPage);
router.get("/auth/logout",isAuth,auth_controller.Logout);




module.exports = router;
