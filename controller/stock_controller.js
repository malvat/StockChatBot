require('dotenv').config();
const model = require('../model/stock');

exports.add = async (req, res) => {
    if(req.body.user_id && req.body.price && req.body.stock_name && req.body.quantity && req.body.ticker) {
        var old_record = await model.Stock.findOne({
            user_id: req.body.user_id,
            ticker: req.body.ticker
        })
        if(old_record) {
            var new_quantity = Number(old_record.quantity) + Number(req.body.quantity);
            model.Stock.findOneAndUpdate({
                user_id: req.body.user_id,
                ticker: req.body.ticker,
            }, {
                quantity: new_quantity,
            }).then( (result) => {
                res.send({
                    error: 0,
                    output: "stock added",
                })
            }).catch( (err) => {
                res.send({
                    error: 1,
                    output: "there was some error",
                })
            })
        } else {
            var new_record = model.Stock({
                user_id: req.body.user_id,
                ticker: req.body.ticker,
                quantity: req.body.quantity,
                stock_name: req.body.stock_name,
                price: req.body.price,
                date: new Date(),
            })
            new_record.save()
            res.send({
                error: 0,
                output: "stock added",
            })
        }
    } else {
        res.send({
            error: 1,
            output: "provide proper parameters",
        })
    }
}

exports.sub = async (req, res) => {
    if(req.body.user_id && req.body.price && req.body.stock_name && req.body.quantity && req.body.ticker) {
        var old_record = await model.Stock.findOne({
            user_id: req.body.user_id,
            ticker: req.body.ticker
        })
        if(old_record) {
            var new_quantity = Number(old_record.quantity) - Number(req.body.quantity);
            if(new_quantity >= 0) {
                model.Stock.findOneAndUpdate({
                    user_id: req.body.user_id,
                    ticker: req.body.ticker,
                }, {
                    quantity: new_quantity,
                }).then( (result) => {
                    res.send({
                        error: 0,
                        output: "stock deducted",
                    })
                }).catch( (err) => {
                    res.send({
                        error: 1,
                        output: "there was some error",
                    })
                })
            } else {
                res.send({
                    error: 1, 
                    output: "not enough stocks"
                })
            }
        } else {
            res.send({
                error: 1, 
                output: "no record found",
            })
        }
    } else {
        res.send({
            error: 1, 
            output: "provide proper parameters",
        })
    }
}