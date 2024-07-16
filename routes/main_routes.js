var router = require("express").Router();
var main_controller = require("./../controllers/main_controller.js");

router.get("/",main_controller.GetHomePage);




module.exports = router;
