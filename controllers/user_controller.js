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
const DeleteAllUsers = async (req, res) => {
  try {
    const result = await User.deleteMany({});
    res.json({ message: "All users have been deleted", deletedCount: result.deletedCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete users", error });
  }
};


const ChangeUser = async (req, res) => {
  try {
    var { username, name, password } = req.body;
    
    const updateData = {
      username: username,
      name: name
    };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
      updateData.decryptPassword = password;
    }

    if (req.file) {
      updateData.profilePicture = req.file.filename;
    }
    console.log(updateData)
    var response = await User.updateOne(
      { _id: req.user._id },
      { $set: updateData }
    );

    res.status(200).json({
      error: null,
      response: response,
      profile:updateData
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error, response: 500 });
  }

}

module.exports.ChangeUser = ChangeUser
module.exports.GetUser = GetUser;
module.exports.DeleteAllUsers = DeleteAllUsers;
