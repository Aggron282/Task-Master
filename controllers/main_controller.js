
var path = require("path");

const GetHomePage = (req,res,next) => {

  res.sendFile(path.join(__dirname,"..","public","homepage.html"));

}


const GetDashboardPage = (req,res,next) => {

  res.sendFile(path.join(__dirname,"..","public","dashboard.html"));

}



module.exports.GetDashboardPage = GetDashboardPage;
module.exports.GetHomePage = GetHomePage;
