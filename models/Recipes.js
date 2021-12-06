const mongoose = require("mongoose");

const recipeSchema = mongoose.Schema({
    recipeID: {
        type: Number,
        default :1
    },
    name:{
        type: String,
        required:true
    },
    creationDate:{
        type: Date,
        default : Date.now
    },
    instructions:{
        type: String
        //default :"NA"

    },
    ingredients:{
        type: Array,
            
        ingredientsName: [
              { type: String }
        ]   
          
    },
    // ingredientsName:{
    //     type: String,
    //     default :"NA"

    // },
    ingredientsSupplierLink:{
        type: String,
        default :"NA"

    },
    ingredientsSubsititution:{
        type: String,
        default :"NA"

    },
    mediaLink:{
        type:String,
        default :"NA"

    },
    commentsContent:{
        type: String,
        default :"NA"

    },
    commentsUserID:{
        type: Number,
        default :-1
    },
    rating:{
        type: Number,
        default:0,
        default :-1

    },
    commentCreatedBy:{
        type: Number,
        default :-1

    },
    difficulty: {
        type: Number,
        default : 1
        },
});

module.exports = mongoose.model('recipes', recipeSchema);