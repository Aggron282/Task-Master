var body_parser = require("body-parser");
var express = require("express");
var app = express();
var User = require("./models/users.js");
var mongoose = require("mongoose");
var session = require("express-session");
var MongoDBStore = require('connect-mongodb-session')(session);
var mongodb_connection = "mongodb+srv://marcokhodr116:aggron828@cluster0.81dhu2y.mongodb.net/task_master?retryWrites=true&w=majority&appName=Cluster0"
var path = require("path");
var port = 3001;

var multer = require("multer");

const fileStorage = multer.diskStorage({

  destination: (req,file,cb) =>{
    cb(null,"images")
  },
  filename: (req,file,cb) =>{
    cb(null,new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }

});


var main_router = require("./routes/main_routes.js");
var board_router = require("./routes/board_routes.js");

app.use(body_parser.json());
app.use(express.static(__dirname + '/public'));
app.use(body_parser.urlencoded({extended:false}));
app.use(multer({storage:fileStorage}).single("thumbnail"));

var StoreSession =  new MongoDBStore({
  uri:mongodb_connection,
  collection:"session"
});

app.use(session({secret:"3489834948394893sjkdev__43898935",saveUninitialized:false,store:StoreSession}));

app.use((req,res,next)=>{

  if(req.session.user){
    User.findById(req.session.user._id).then((user)=>{
      console.log(req.user);
      req.user = user;
      next();
    });
  }
  else{
    next();
  }

});

app.use(main_router);
app.use(board_router);

mongoose.connect(mongodb_connection).then((s)=>{

  app.listen(port,()=>{
    console.log("App listening on localhost:"+port);
  })

});
