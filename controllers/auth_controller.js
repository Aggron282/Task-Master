const path = require("path");
const bcrypt = require('bcrypt');
const User = require("./../models/users.js");

const GetLoginPage = (req,res,next) => {
  res.sendFile(path.join(__dirname,"..","public","login.html"));
}

const GetCreateAccountPage = (req,res,next) => {
  res.sendFile(path.join(__dirname,"..","public","create_account.html"));
}

const Logout = (req,res,next)=>{

    req.user = null;

    req.session.isAuthenticated = null;

    res.redirect("/");

}

const DeleteAccount = async (req,res,next) => {

  try{

    var response  = await User.deleteOne({_id:req.user._id})
    req.user = null;
    res.redirect("/");
  }
  catch(error){
    console.log(error);
    res.status(500).json({error:error});
  }

}

const Login = async (req,res,next)=>{

  var account = req.body;

  User.findOne({username:account.username}).then(async (result)=>{

    if(!result){
      res.json({error:"Wrong username/password"});
      return;
    }

    if(!account){
      res.json({error:"Wrong username/password"});
      return;
    }

    const isMatch = await bcrypt.compare(account.password, result.password);

    if(!result){
      res.json({error:"Wrong username/password"});
      return;
    }
    else if(isMatch){

      req.session.user = result;
      req.session.isAuthenticated = true;

      res.json({error:null});

    }
    else{
      res.json({error:"Wrong username/password"});
    }

  })

}

const CreateAccount = async (req,res,next) => {

  var username = req.body.account.username;
  var password = req.body.account.password;

  User.find({username:username}).then(async (data)=>{

    if(data.length > 0){
      res.json({error:"a user exists with same username"});
    }
    else{
      const hashedPassword = await bcrypt.hash(password, 10);
      var new_account = {
          username:username,
          name:"",
          decryptPassword:password,
          profilePicture:"",
          password:hashedPassword,
          boards:[]
      }

      var account_saved = new User(new_account);

      account_saved.save();
      req.session.user = account_saved
      res.json({error:null});

    }

  });

}

module.exports.DeleteAccount = DeleteAccount;
module.exports.Logout = Logout;
module.exports.GetLoginPage = GetLoginPage;
module.exports.GetCreateAccountPage = GetCreateAccountPage;
module.exports.CreateAccount = CreateAccount;
module.exports.Login = Login;
