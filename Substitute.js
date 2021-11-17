const mongoose = require('mongoose');
const substituteSchema = mongoose.Schema({
    ingredient: {
        type: String,
        required:true
    },
    substitute:{
        type: String,
        required:true
        },
    substitute_URL:{
        type: String
        },

});

module.exports = mongoose.model('substitute', substituteSchema);