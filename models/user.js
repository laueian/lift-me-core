const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    googleId: String,
    facebookId: String,
    thumbnail: String
});

module.exports = mongoose.model('user', userSchema);;