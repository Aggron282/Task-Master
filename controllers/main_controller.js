const path = require("path");

const GetHomePage = (req,res,next) => {
  res.sendFile(path.join(__dirname,"..","public","homepage.html"));
}

const GetDashboardPage = (req,res,next) => {
  res.sendFile(path.join(__dirname,"..","public","dashboard.html"));
}

const GetUserData = (req,res,next) => {

  if(req.user){
    res.json(req.user);
  }
  else{
    res.json(null);
  }

}

module.exports.GetUserData = GetUserData;
module.exports.GetDashboardPage = GetDashboardPage;
module.exports.GetHomePage = GetHomePage;
