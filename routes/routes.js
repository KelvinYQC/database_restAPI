const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user_controller.js');
const nodemailer = require('nodemailer');
const csurf = require("csurf");
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
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

var MongoDBSession = require('connect-mongodb-session')(session);

const store = new MongoDBSession({
    uri:process.env.DB_CONNECTION,
    collection:'sessions'
});

store.on('error', function(error) {
    console.log(error);
  });

  router.use(session({
    resave: false,
    saveUninitialized: false,
    secret: "secret",
    store:store,
    cookie:{
        expires:10000000 // a day
    }
}))


router.use(csurf())
router.get("/login", async(req, res) => {
  let user = "Guest"
  
// enter if statement only if login successful
  if (req.session.email){
     email = req.session.email
     user = await User.findOne({ email}).exec();
     return res.send(
       
      `
      <body>${user}</body>
      <form action="/api/verify/logout" method="POST">
     <input type="hidden" name="_csrf" value="${req.csrfToken()}">
     <button>Logout</button>
   </form>`)
  }

  res.send(`
  <h1>${user}</h1>
  <form action="/api/verify/login" method="POST">
    <input type="text" name="password" placeholder="Your password">
    <input type="text" name="email" placeholder="Your email">
    <input type="hidden" name="_csrf" value="${req.csrfToken()}">
    <button>Submit</button>
  </form>
  <form action="/api/verify/logout" method="POST">
    <input type="hidden" name="_csrf" value="${req.csrfToken()}">
    <button>Logout</button>
  </form>
  `)
})


router.post("/login", async(req, res) => {

  const { password } = req.body
    const {email} = req.body
    // Check we have an email
    if (!email) {
         res.status(422).send({ 
             message: "Missing email." 
        });
    }
    try{
        // Step 1 - Verify a user with the email exists
        const user = await User.findOne({ email, password}).exec();
        if (!user) {
             res.status(404).send({ 
                   message: "Password or username is incorrect" 
             });
        }
        // Step 2 - Ensure the account has been verified
        if(!user.verified){
              res.status(403).send({ 
                   message: "Verify your Account." 
             });
            }
          if(user){
            console.log("----------")
             req.session.email = req.body.email.trim()
             req.session.password = req.body.password.trim()
      
            res.send(`<p>Thank you</p> <a href="/api/verify/login">Back home</a>`)
          }
          
          } catch(err) {
          res.status(500).send(err);
}
})

router.post("/logout", (req, res) => {
  req.session.destroy(err => {
    res.redirect("./login")
  })
})

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