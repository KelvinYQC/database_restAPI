// const express = require("express");
// const session = require('express-session');
// const app = express();
// const cors = require("cors");
// const bodyPaser = require('body-parser');
// const mongoose = require("mongoose");
// const MongoStore = require('connect-mongo')(session);

// var User = require('../models/UserInfo')

// app.use(cors());

// var conn = mongoose.connection;
// conn.on('connected',() =>{
//     console.log('MongoDB connected')
// });

// conn.on('error',(err)=>{
//     if(err)
//     console.log(err)
// });


// app.use(session({
//     secret: 'ssshhhhh',
//     saveUninitialized: false,
//     resave: true,
//     store: new MongoStore({
//         mongooseConnection: conn
//     })
// }));

// app.get('/', function(req, res){
//     if (req.session.userId != undefined || null) {
//       res.redirect('/home');
//     } else {
//       res.send('Username'+
//       'Password'+
//          'Login'+
//        '');}
//   })
  
//   app.post('/login', function (req, res, next) {
//       if (req.body.username && req.body.password) {
//        User.authenticate(req.body.username, req.body.password, function (error, user) {
//          if (error || !user) {
//            var err = new Error('Some error occured!');
//            err.status = 401;
//            return next(err.message);
//          } else {
//          //res.send(user);
//          req.session.userId = user.userid;
//          res.redirect('/home');
//          }
//        });
//      } else {
//        var err = new Error('Something went wrong!');
//        err.status = 400;
//        return next(err.message);
//      }
//    });
  
//    app.get('/home',(req , res)=>{
//     if (req.session.userId != undefined || null){
//      res.send('Welcome to HOME Page!User Session Details:'+JSON.stringify(req.session)+''+
//      'Logout');
//     } else {
//       res.redirect('/');
//     }
//    })
  
//    // GET for logout logout
//    app.get('/logout', function (req, res, next) {
//     if (req.session.userId) {
//       // delete session object
//       req.session.destroy(function (err) {
//         if (err) {
//           return next(err);
//         } else {
//           return res.redirect('/');
//         }
//       });
//     }
//   });