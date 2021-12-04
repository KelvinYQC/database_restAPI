const express = require("express")
const session = require("express-session")
const MongoStore = require("connect-mongo")(session)
const client = require("./db.js")
const csurf = require("csurf")
const mongoose = require("mongoose");


const app = express()
app.use(express.urlencoded({ extended: false }))

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

// connect to mongoose
mongoose.connect(
    process.env.DB_CONNECTION, 
   {useNewUrlParser:true},
    () =>console.log("database is conncted")    
);

// setport
const PORT = process.env.PORT  || 3456;

app.listen(PORT, () => console.log(`listening on ${PORT}`));

//module.exports = app