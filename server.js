const port = process.env.PORT || 3001;
const body_parser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require('connect-mongodb-session')(session);
const path = require("path");
const multer = require("multer");

const mongodb_connection = require("./util/db.js").mongodb_connection;

const User = require("./models/users.js");

const app = express();

const auth_router = require("./routes/auth_routes.js");
const main_router = require("./routes/main_routes.js");
const user_router = require("./routes/user_routes.js");
const board_router = require("./routes/board_routes.js");
const dashboard_router = require("./routes/dashboard_routes.js");

app.use(body_parser.json());

app.use(express.static(__dirname + '/public'));
app.use(body_parser.urlencoded({extended:false}));


var StoreSession =  new MongoDBStore({
  uri:mongodb_connection,
  collection:"session"
});

app.use(session({secret:"3489834948394893sjkdev__43898935",saveUninitialized:false,store:StoreSession}));

app.use((req,res,next)=>{

  if(req.session.user){

    User.findById(req.session.user._id).then((user)=>{
      req.user = user;
      next();
    });

  }else{
    next();
  }

});

app.use(main_router);
app.use(board_router);
app.use(dashboard_router);
app.use(auth_router);
app.use(user_router);

mongoose.connect(mongodb_connection).then((s)=>{

  app.listen(port,()=>{
    console.log("App listening on localhost:"+port);
  })

});
