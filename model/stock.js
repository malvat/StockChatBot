const mongoose = require('mongoose')
const types = mongoose.Schema.Types;

const Stock = new mongoose.Schema({
    user_id: types.ObjectId,
    stock_name: types.String,
    ticker: types.String,
    price: types.Number,
    quantity: types.Number,
    date: types.Date,
});


exports.Stock = mongoose.model('stock', Stock);