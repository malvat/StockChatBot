const mongoose = require('mongoose')

const User = new mongoose.Schema({
    first_name: String,
    last_name: String, 
    email: String,
    password: String
});


exports.User = mongoose.model('user', User);