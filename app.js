const express = require("express");
const session = require('express-session');
const app = express();
const cors = require("cors");
const bodyPaser = require('body-parser');
const mongoose = require("mongoose");
const MongoStore = require('connect-mongo')(session);

// require package for mongodb
require("dotenv/config");
app.use(express.urlencoded({extended:true}));
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

// app.use("/api/verification", routeVerification);
app.use('/api/verify', require('./routes/routes.js'));

// homepage
app.get("/", (req,res) => {
    res.send("we are on 5000 homepage")
});

// connect to mongoose
mongoose.connect(
     process.env.DB_CONNECTION, 
    {useNewUrlParser:true},
     () =>console.log("database is conncted")    
);

// setport
const PORT = process.env.PORT  || 3456;

app.listen(PORT, () => console.log(`listening on ${PORT}`));