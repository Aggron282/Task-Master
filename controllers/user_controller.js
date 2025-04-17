const User = require("./../models/users.js");
const Task = require("./../data/task_class.js");
const Board = require("./../models/tasks.js");

const generateUniqueId = require('generate-unique-id');
const path = require("path")
const bcrypt = require('bcrypt');

const GetUser = async (req,res) => {

  try{
    var found_user = await User.findOne({_id:req.user._id});

    if(found_user){
      res.json({profile:found_user});
    }else{
      res.json({profile:null})
    }
  }catch(error){
    console.log(error);
    res.status(500).json({profile:null,error:error});
  }

}


const ChangeUser = async (req,res) => {
  try{

      var {username,name,password} = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      var change_set = {$set: {
            username: username,
            password: password,
            name: name
          }}

      var response = await User.updateOne({_id:req.user._id},change_set);
      console.log(response);
      res.status(200).json({
        error:null,
        response:response
      });

  }
  catch(error){
    res.status(500).json({error:error,response:500})
  }

}

module.exports.ChangeUser = ChangeUser
module.exports.GetUser = GetUser;
