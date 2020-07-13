require('dotenv').config();
const model = require('../model/credit');

exports.add = async (req, res) => {
    if(req.body.user_id && req.body.credit) {
        var old_record = await model.Credit.findOne({
            user_id: req.body.user_id,
        });
        if(old_record) {
            var new_credit = Number(old_record.credit) + Number(req.body.credit);
            await model.Credit.findOneAndUpdate({
                user_id: req.body.user_id,
                credit: new_credit,
            });
            res.send({
                error: 0,
                output: "credit updated",
            });
        } else {
            var new_record = new model.Credit({
                user_id: req.body.user_id,
                credit: req.body.credit,
            })
            new_record.save();
            res.send({
                error: 0,
                output: "credit created",
            })
        }
    } else {
        res.send({
            error: 1, 
            output: "provide proper credentials",
        })
    }
}

exports.sub = async (req, res) => {
    if(req.body.user_id && req.body.credit) {
        var old_record = await model.Credit.findOne({
            user_id: req.body.user_id,
        });

        if(old_record) {
            var new_credit;
            if(Number(old_record.credit) > Number(req.body.credit)) {
                new_credit = Number(old_record.credit) - Number(req.body.credit);
                model.Credit.findOneAndUpdate({
                    user_id: req.body.user_id,
                }, {
                    credit: new_credit,
                }).then( (result) => {
                    res.send({
                        error: 0,
                        output: "credit updated",
                    })
                }).catch( (result) => {
                    res.send({
                        error: 1,
                        output: "try again later",
                    })
                })
            } else {
                res.send({
                    error: 1,
                    output: "not enough credit",
                })
            }
        } else {
            res.send({
                error: 1,
                output: "no credit information found",
            })
        }
    } else {
        res.send({
            error: 1,
            output: "provide proper credentials",
        })
    }
}