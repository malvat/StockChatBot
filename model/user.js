const mongoose = require('mongoose')
const types = mongoose.Schema.Types

const User = new mongoose.Schema({
    first_name: types.String,
    last_name: types.String, 
    email: types.String,
    password: types.String
});


exports.User = mongoose.model('user', User);