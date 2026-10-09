const mongoose = require('mongoose')



const tokenBlacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    }
});
 const tokenBlacklistModel = mongoose.model('Tokenblacklist', tokenBlacklistSchema);


 module.exports = tokenBlacklistModel;