// recipe page
const express = require("express");
const router = express.Router();

const UserInfo = require("../models/Substitute");

// get all the recipes
router.get("/",async(req,res)=>{
    try{
        const users = await UserInfo.find();
        res.status(200).json(users);
    }catch(err){
        res.status(500).json({message: err});
    }
});

// get one the recipes
router.get("/:recipeID", async (req,res) => {
    try{
        const id = req.params.recipeID;
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


// post a recipes
router.post("/", async(req,res) => {
    const myuser = new UserInfo({
        ingredient: req.body.ingredient,
        substitute: req.body.substitute,
        substitute_URL: req.body.substitute_URL
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

// update a recipes
router.patch("/:recipeID", async (req, res) => {
    try {
      const id = req.params.recipeID;
      const updatedCourse = await UserInfo.updateOne(
        { _id: id },
        {
          $set: { 
            ingredient: req.body.ingredient,
            substitute: req.body.substitute,
            substitute_URL: req.body.substitute_URL
            }
        }
      );
      res.status(200).json(updatedCourse);
    } catch (err) {
      res.status(500).json({ message: err });
    }
  });

  // delete a recipes
  router.delete("/:recipeID", async (req, res) => {
    try {
      const id = req.params.recipeID;
      const removedCourse = await UserInfo.deleteOne({ _id: id });
      res.status(200).json(removedCourse);
    } catch (err) {
      res.status(500).json({ message: err });
    }
  });


module.exports = router;