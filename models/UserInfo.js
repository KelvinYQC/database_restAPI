const mongoose = require("mongoose");

const userInfoSchema = mongoose.Schema({
    userID: {
        type: Number,
        required:true
    },
    userName:{
        type: String,
        required:true
    },
    creationDate:{
        type: Date,
        default : Date.now
    },
    level:{
        type: Number,
        default : 0
    },
    email:{
        type: String,
    },
    password:{
        type:String,
        required : true
    },
    recipeCreation:{
        type:Number,
        default : 0
    },
    commentReceived:{
        type:Number,
        default : 0

    },
    likeReceived:{
        type:Number,
        default : 0

    },
    commentPublished:{
        type:Number,
        default : 0
    },
});

module.exports = mongoose.model('userInfo', userInfoSchema);