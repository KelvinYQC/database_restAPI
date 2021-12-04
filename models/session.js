const mongoose = require("mongoose");


const sessionSchema = mongoose.Schema({
    userID: {
        type: Number,
        //required:true
    },    
});


module.exports = mongoose.model('session', sessionSchema);