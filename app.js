var body_parser = require("body-parser");
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var mongodb_connection = "mongodb+srv://marcokhodr116:mawhile12@cluster0.81dhu2y.mongodb.net/task_master?retryWrites=true&w=majority&appName=Cluster0"
var path = require("path");
var port = 3001;

var main_router = require("./routes/main_routes.js");

app.use(body_parser.json());
app.use(express.static(__dirname + '/public'));
app.use(body_parser.urlencoded({extended:false}));
app.use(main_router);

mongoose.connect(mongodb_connection).then((s)=>{

  app.listen(port,()=>{

    console.log("App listening on localhost:"+port);

  })

});
