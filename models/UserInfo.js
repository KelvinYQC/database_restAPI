const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');



const userInfoSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    userID: {
        type: Number,
        //required:true
    },
    userName:{
        type: String,
        //required:true
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
    verified:{
        type: Boolean,
        //required: true,
        default: false
    },
    password:{
        type:String,
        //required : true
    },
    discription:{
        type:String,
        //required : true
    },
    userPicture:{
        type:String,
        //required : true
    },
    userPost:{
        type:String,
        //required : true
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

userInfoSchema.methods.generateVerificationToken = function(){
    const user = this;
    const verificationToken = jwt.sign(
        { ID: user._id },
        process.env.USER_VERIFICATION_TOKEN_SECRET,
        { expiresIn: "7d"}
    );
    return verificationToken;
}

module.exports = mongoose.model('userInfo', userInfoSchema);