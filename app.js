var bodyParser = require("body-parser");
var express = require("express");
var app = express();

var path = require("path");
var port = 3001;

var main_router = require("./routes/main_routes.js");


app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(main_router);

app.listen(port,()=>{

  console.log("App listening on localhost:"+port);

})
