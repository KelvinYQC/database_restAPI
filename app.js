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
// app.use("/api/verify", require("./routes/routes"));

// homepage
// app.get("/", (req,res) => {
//     res.cookie("sky","blue", {httpOnly:true, secure:true})
//     res.send("we are on 5000 homepage")
// });

// code goes here

var MongoDBSession = require('connect-mongodb-session')(session);

const store = new MongoDBSession({
    uri:process.env.DB_CONNECTION,
    collection:'sessions'
});

store.on('error', function(error) {
    console.log(error);
  });

  app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: "secret",
    store:store,
    cookie:{
        expires:10000000 // a day
    }
}))

app.use(csurf())
app.get("/", (req, res) => {
  let name = "Guest"

  if (req.session.user) name = req.session.user

  res.send(`
  <h1>Welcome, ${name}</h1>
  <form action="/choose-name" method="POST">
    <input type="text" name="name" placeholder="Your name">
    <input type="hidden" name="_csrf" value="${req.csrfToken()}">
    <button>Submit</button>
  </form>
  <form action="/logout" method="POST">
    <input type="hidden" name="_csrf" value="${req.csrfToken()}">
    <button>Logout</button>
  </form>
  `)
})

app.post("/choose-name", (req, res) => {
  req.session.user = req.body.name.trim()
  res.send(`<p>Thank you</p> <a href="/">Back home</a>`)
})

app.post("/logout", (req, res) => {
  req.session.destroy(err => {
    res.redirect("/")
  })
})



///





// connect to mongoose
mongoose.connect(
     process.env.DB_CONNECTION, 
    {useNewUrlParser:true},
     () =>console.log("database is conncted")    
);

// setport
const PORT = process.env.PORT  || 3456;

app.listen(PORT, () => console.log(`listening on ${PORT}`));