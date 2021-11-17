// Gallery Collection

const express = require("express");
const router = express.Router();
const GalleryInfo = require("../models/Gallery");

// get all gallery posts
router.get("/",async(req,res)=>{
    try{
        const users = await GalleryInfo.find();
        res.status(200).json(users);
    }catch(err){
        res.status(500).json({message: err});
    }
});

// get a specific gallery posts
router.get("/:recipeID", async (req,res) => {
    try{
        const id = req.params.recipeID;
        const users = await GalleryInfo.findById(id);
        if(users){
                res.status(200).json(users);
            } else{
                res.status(404).json({message: "No valid entry found"});
            }
        }   catch (err) {
            res.status(500).json({message:err});
        }
});


// post a gallery posts
router.post("/", async(req,res) => {
  const thePost = new GalleryInfo({
      postID: req.body.postID,
      userID:req.body.userID,
      content:req.body.content,
      media:req.body.media,
      commentsContent:req.body.commentsContent,
      commentsuserID:req.body.commentsuserID,
      commentsLikerecived:req.body.commentsLikerecived,
      commentsCreationdate:req.body.commentsCreationdate
  });
  try{
      const savedPost = await thePost.save();
      res.status(201).json({
          message: "post success",
          createdUser: savedPost
          });
      }
      catch(err) {
      res.status(500).json({message: err});
      }
}); 


// update a gallery post
router.patch("/:recipeID", async (req, res) => {
    try {
      const id = req.params.recipeID;
      const updatedCourse = await GalleryInfo.updateOne(
        { _id: id },
        {
          $set: { 
            content: req.body.content,
            media: req.body.media,
            commentsContent: req.body.commentsContent,
            commentsLikerecived: req.body.commentsLikerecived,
          }
        }
      );
      res.status(200).json(updatedCourse);
    } catch (err) {
      res.status(500).json({ message: err });
    }
  });

  // delete a gallery post
  router.delete("/:recipeID", async (req, res) => {
    try {
      const id = req.params.recipeID;
      const removedCourse = await GalleryInfo.deleteOne({ _id: id });
      res.status(200).json(removedCourse);
    } catch (err) {
      res.status(500).json({ message: err });
    }
  });


module.exports = router;
