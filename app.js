const express = require("express");
const session = require('express-session');
const csurf = require("csurf")
const app = express();
const cors = require("cors");
const bodyPaser = require('body-parser');
const mongoose = require("mongoose");
var MongoDBSession = require('connect-mongodb-session')(session);


// require package for mongodb
require("dotenv/config");
// app.use(express.urlencoded({extended:true}));
app.use(express.urlencoded({ extended: false }))
app.use(express.json());


// path for different page and database connections
const routeUsers = require("./routes/userInfo");
const routeGallery = require("./routes/gallery");
const routeRecipes = require("./routes/recipes");
const routeSubstitute = require("./routes/substitute");

// Middleware
app.use(cors());
app.use("/api/userInfo", routeUsers);
app.use("/api/gallery", routeGallery);
app.use("/api/recipes", routeRecipes);
app.use("/api/substitution", routeSubstitute);
app.use("/api/verify", require("./routes/routes"));

// homepage
// app.get("/", (req,res) => {
//     res.cookie("sky","blue", {httpOnly:true, secure:true})
//     res.send("we are on 5000 homepage")
// });

// code goes here

// var MongoDBSession = require('connect-mongodb-session')(session);

// const store = new MongoDBSession({
//     uri:process.env.DB_CONNECTION,
//     collection:'sessions'
// });

// store.on('error', function(error) {
//     console.log(error);
//   });

//   app.use(session({
//     resave: false,
//     saveUninitialized: false,
//     secret: "secret",
//     store:store,
//     cookie:{
//         expires:10000000 // a day
//     }
// }))

// const User = require('./models/UserInfo');



// app.use(csurf())
// app.get("/api/verify/login", async(req, res) => {
//   let user = "Guest"
  
// // enter if statement only if login successful
//   if (req.session.email){
//      email = req.session.email
//      user = await User.findOne({ email}).exec();
//      return res.send(
       
//       `
//       <body>${user}</body>
//       <form action="/api/verify/logout" method="POST">
//      <input type="hidden" name="_csrf" value="${req.csrfToken()}">
//      <button>Logout</button>
//    </form>`)
//   }

//   res.send(`
//   <h1>${user}</h1>
//   <form action="/api/verify/login" method="POST">
//     <input type="text" name="password" placeholder="Your password">
//     <input type="text" name="email" placeholder="Your email">
//     <input type="hidden" name="_csrf" value="${req.csrfToken()}">
//     <button>Submit</button>
//   </form>
//   <form action="/api/verify/logout" method="POST">
//     <input type="hidden" name="_csrf" value="${req.csrfToken()}">
//     <button>Logout</button>
//   </form>
//   `)
// })


// app.post("/api/verify/login", async(req, res) => {

//   const { password } = req.body
//     const {email} = req.body
// console.log(password)
// console.log(email)
//     // Check we have an email
//     if (!email) {
//          res.status(422).send({ 
//              message: "Missing email." 
//         });
//     }
//     try{
//         // Step 1 - Verify a user with the email exists
//         const user = await User.findOne({ email, password}).exec();
//         if (!user) {
//              res.status(404).send({ 
//                    message: "Password or username is incorrect" 
//              });
//         }
//         // Step 2 - Ensure the account has been verified
//         if(!user.verified){
//               res.status(403).send({ 
//                    message: "Verify your Account." 
//              });
//             }
//           if(user){
//             console.log("----------")
//              req.session.email = req.body.email.trim()
//              req.session.password = req.body.password.trim()
      
//             res.send(`<p>Thank you</p> <a href="/api/verify/login">Back home</a>`)
//           }
          
//           } catch(err) {
//           res.status(500).send(err);
// }
// })

// app.post("/api/verify/logout", (req, res) => {
//   req.session.destroy(err => {
//     res.redirect("/api/verify/login")
//   })
// })


// connect to mongoose
mongoose.connect(
     process.env.DB_CONNECTION, 
    {useNewUrlParser:true},
     () =>console.log("database is conncted")    
);

// setport
const PORT = process.env.PORT  || 3456;

app.listen(PORT, () => console.log(`listening on ${PORT}`));