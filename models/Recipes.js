const mongoose = require("mongoose");

const recipeSchema = mongoose.Schema({
    recipeID: {
        type: Number,
        required:true
    },
    name:{
        type: String,
        required:true
    },
    creationDate:{
        type: Date,
        default : Date.now
    },
    instruction:{
        type: String,
    },
    ingredientsName:{
        type: String,
    },
    ingredientsSupplierLink:{
        type: String,
    },
    ingredientsSubsititution:{
        type: String,
    },
    mediaLink:{
        type:String,
    },
    commentsContent:{
        type: String
    },
    commentsUserID:{
        type: Number
    },
    rating:{
        type: Number,
        default:0
    },
    commentCreatedBy:{
        type: Number
    }
});

module.exports = mongoose.model('recipes', recipeSchema);