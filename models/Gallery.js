const mongoose = require('mongoose');
const GallerySchema = mongoose.Schema({
    postID: {
        type: Number,
        required:true
    },
    userID:{
        type: Number
        },
    creationDate:{
        type: Date,
        default : Date.now
    },
    content:{
        type: String,
    },
    media:{
        type: String,
    },
    likeCount:{
        type: Number,
    },
    comment:[{
        commentsuserID:{
            type: Number,
        },
        commentsContent:{
            type: String,
        },
        commentsLikerecived:{
            type: Number,
        },
        commentsCreationdate:{
            type: Date,
            default : Date.now
        }
        
    }],
    

});

module.exports = mongoose.model('gallery', GallerySchema);