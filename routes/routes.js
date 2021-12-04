const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user_controller.js');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = express()
const User = require('../models/UserInfo.js');
const Session = require('../models/session');
const { application } = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { route } = require('./userInfo.js');

router.use(bodyParser.urlencoded({
    extended:true
}))
var MongoDBSession = require('connect-mongodb-session')(session);

const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
      },
});

router.use(cookieParser())

// const store = new MongoDBSession({
//     uri:process.env.DB_CONNECTION,
//     collection:'sessions'
// });

// store.on('error', function(error) {
//     console.log(error);
//   });

//   router.use(session({
//     key:"email",
//     resave: false,
//     saveUninitialized: false,
//     secret: "secret",
//     store:store,
//     cookie:{
//         expires:10000000 // a day
//     }
// }))

// var sessionChecker = (req,res,next)=>{
//     if ( req.session.user && req.cookies.email){
//         res.redirect('./dashboard')
// }
// else{
//     next()
// }
// }
// app.get('/', sessionChecker,(req,res)=>{
//     res.redirect('/login')
// })

//  const redirectlogin = (req,res,next) =>{
//      if(!req.session.userId){
//          res.redirect('./login')
//      }
//      else{
//          next()
//      }
//  }


//  const redirecthome = (req,res,next)=>{
//      if(req.session.userId){
//          res.redirect('./dashboard')
//      } else{
//          next()
//      }   
//  }

router.use((req,res,next)=>{
    const {id} = req.session
    console.log(id)
    if(id){
        res.locals.user = User.findOne({id})
    }
    
    next()
})

router.get("/dashboard",async(req,res)=>{
    try{
        const{user} = res.locals
        //req.session.user = res.locals
        // req.session.user = 'aaa'
         //req.session.user = user
        // ses = req.session
        // console.log(ses)
       // res.status(200).json(req.session.user);

        // console.log(JSON.stringify(req.session.user))

        // const users = await Session.find();
        // console.log(JSON.stringify(users))

        // console.log("----------")
        // res.status(200).json(users);
    }catch(err){
        res.status(500).json({message: err});
    }
});

router.get("/dashboardInfo",async(req,res)=>{
    try{
        
       // console.log("----------")
       // const users = await Session.find();
      //  console.log(JSON.stringify(users))
       // console.log("----------")
        res.status(200).json(req.session);
    }catch(err){
        res.status(500).json({message: err});
    }
});


router.get("/:_id", async (req,res) => {
    try{
        const id = req.params.user._id;
        const users = await Session.user.findById(id);
        if(users){
                res.status(200).json(users);
            } else{
                res.status(404).json({message: "No valid entry found"});
            }
        }   catch (err) {
            res.status(500).json({message:err});
        }
});



//  router.get('/dashboard',(req,res)=>{
//      console.log("----------")
//      console.log(JSON.stringify(req.session.user))
//      console.log("----------")
     
//      // res.cookie("cookie", req.session.user);
//      //return 
//     return res.send('Hello ' + JSON.stringify(req.session.user._id));
//  })
 

// router.get('/session',(req,res)=>{
//     const {userId} = req.session
//     console.log(userId)
// })


 router.post('/logout', function(req,res){
     req.session.destroy(err =>{
         if(err){
             return res.redirect('./dashboard')
         }
        res.clearCookie("email")
        res.redirect('/login')
        })
     })


router.post('/signup', async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    const userName = req.body.userName

    // Check we have an email
    if (!email) {
       res.status(422).send({ message: "Missing email." });
    }
    try{
       // Check if the email is in use
       const existingUser = await User.findOne({ email }).exec();
       if (existingUser) {
          res.status(409).send({ 
                message: "Email is already in use."
          });
        }
       // Step 1 - Create and save the user
       const user = await new User({
           _id: new mongoose.Types.ObjectId,
          email: email,
          password:password,
          userName:userName
          // add more info here
       }).save();
       // Step 2 - Generate a verification token with the user's ID
       const verificationToken = user.generateVerificationToken();
       // Step 3 - Email the user a unique verification link
       const url = `http://localhost:3456/api/verify/${verificationToken}`
       transporter.sendMail({
         to: email,
         subject: 'Verify Account',
         html: `Click <a href = '${url}'>here</a> to confirm your email.`
       })
         res.status(201).send({
         message: `Sent a verification email to ${email}`
       });
   } catch(err){
       res.status(500).send(err);
   }
});

router.post('/login', async (req, res) => {
    const { email } = req.body
    const {userName} = req.body

    // Check we have an email
    if (!email) {
         res.status(422).send({ 
             message: "Missing email." 
        });
    }
    try{
        // Step 1 - Verify a user with the email exists
        const user = await User.findOne({ email, userName}).exec();
        if (!user) {
             res.status(404).send({ 
                   message: "User does not exists" 
             });
        }
        // Step 2 - Ensure the account has been verified
        if(!user.verified){
              res.status(403).send({ 
                   message: "Verify your Account." 
             });
        }
        
        if(user){
            res.cookie("sky","blue1")

            req.session.id = user._id
        //  res.status(200).send({
        //       message: "User logged in"
        //  });
        // console.log(user)
        //res.cookie("cookie", req.session.user);
        res.redirect('./dashboard');
        }
     } catch(err) {
        res.status(500).send(err);
     }
});

router.get('/session',async(req,res)=>{
    res.send(req.session.user)
}
)

router.get('/:id', async (req, res) => {
    const [token]  =  Object.values(req.params)   // Check we have an id
    if (!token) {
         res.status(422).send({ 
             message: "Missing Token" 
        });
    }    // Step 1 -  Verify the token from the URL
    let payload = null
    try {
        payload = jwt.verify(
            token,
           process.env.USER_VERIFICATION_TOKEN_SECRET
        );
    } catch (err) {
         res.status(500).send(err);
    }    try{
        // Step 2 - Find user with matching ID
        const user = await User.findOne({ _id: payload.ID }).exec();
        if (!user) {
           res.status(404).send({ 
              message: "User does not exists" 
           });
        }        // Step 3 - Update user verification status to true
        user.verified = true;
        await user.save();        
        res.status(200).send({
              message: "Account Verified"
        });
     } catch (err) {
        res.status(500).send(err);
     }
});




module.exports = router;