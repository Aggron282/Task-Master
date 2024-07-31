var path = require("path");
const User = require("./../models/users.js");

const GetHomePage = (req,res,next) => {
  res.sendFile(path.join(__dirname,"..","public","homepage.html"));
}

const GetLoginPage = (req,res,next) => {
  res.sendFile(path.join(__dirname,"..","public","login.html"));
}

const GetDashboardPage = (req,res,next) => {
  res.sendFile(path.join(__dirname,"..","public","dashboard.html"));
}

const GetCreateAccountPage = (req,res,next) => {
  res.sendFile(path.join(__dirname,"..","public","create_account.html"));
}

const Login = (req,res,next)=>{

  var account = req.body;

  User.findOne({username:account.username}).then((result)=>{
    console.log(result);
    if(!result){
      res.json({error:"Wrong username/password"});
    }
    else if(result.password == account.password){
      res.json({error:null});
    }
    else{
      res.json({error:"Wrong username/password"});
    }

  })

}

const CreateAccount = (req,res,next) => {

  var username = req.body.account.username;
  var password = req.body.account.password;

  User.find({username:username}).then((data)=>{

    if(data.length > 0){
      res.json({error:"a user exists with same username"});
    }
    else{

      var new_account = {
          username:username,
          name:"",
          profilePicture:"",
          password:password,
          tasks:[]
      }

      var account_saved = new User(new_account);

      account_saved.save();

      res.json({error:null});

    }

  });

}

module.exports.GetLoginPage = GetLoginPage;
module.exports.GetCreateAccountPage = GetCreateAccountPage;
module.exports.CreateAccount = CreateAccount;
module.exports.GetDashboardPage = GetDashboardPage;
module.exports.GetHomePage = GetHomePage;
module.exports.Login = Login;
