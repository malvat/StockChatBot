const mongoose = require('mongoose')
const types = mongoose.Schema.Types;

const Credit = new mongoose.Schema({
    user_id: types.ObjectId,
    credit: types.String,
});


exports.Credit = mongoose.model('credit', Credit);