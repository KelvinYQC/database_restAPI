const express = require("express");
const router = express.Router();

const UserInfo = require("../models/UserInfo");

// find all users
router.get("/",async(req,res)=>{
    try{
        const users = await UserInfo.find();
        res.status(200).json(users);
    }catch(err){
        res.status(500).json({message: err});
    }
});

// find a specific users
router.get("/:userID", async (req,res) => {
    try{
        const id = req.params.userID;
        const users = await UserInfo.findById(id);
        if(users){
                res.status(200).json(users);
            } else{
                res.status(404).json({message: "No valid entry found"});
            }
        }   catch (err) {
            res.status(500).json({message:err});
        }
});


// add a new user
router.post("/", async(req,res) => {
    const myuser = new UserInfo({
        userID: req.body.userID,
        userName:req.body.userName,
        password:req.body.password,
        level:req.body.level,
        email:req.body.email,
        recipeCreation:req.body.recipeCreation,
        commentReceived:req.body.commentReceived,
        likeReceived:req.body.likeReceived,
        commentPublished:req.body.commentPublished
    });
    try{
        const savedUsers = await myuser.save();
        res.status(201).json({
            message: "post success",
            createdUser: savedUsers
            });
        }
        catch(err) {
        res.status(500).json({message: err});
        }
}); 

// update a  user
router.patch("/:userID", async (req, res) => {
    try {
      const id = req.params.userID;
      const updatedCourse = await UserInfo.updateOne(
        { _id: id },
        {
          $set: { 
            userName: req.body.userName,
            level: req.body.level,
            email: req.body.email,
            password: req.body.password,
            recipeCreation: req.body.recipeCreation,
            commentReceived: req.body.commentReceived,
            likeReceived: req.body.likeReceived,
            commentPublished: req.body.commentPublished,
          }
        }
      );
      res.status(200).json(updatedCourse);
    } catch (err) {
      res.status(500).json({ message: err });
    }
  });

  // delete a user
  router.delete("/:userID", async (req, res) => {
    try {
      const id = req.params.userID;
      const removedCourse = await UserInfo.deleteOne({ _id: id });
      res.status(200).json(removedCourse);
    } catch (err) {
      res.status(500).json({ message: err });
    }
  });


module.exports = router;