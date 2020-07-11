const model = require('../model/user');

/**
 * creates a user with given parameters
 * @param {json} req request object
 * @param {json} res response object
 */
exports.create = async (req, res) => {
    if(req.body.first_name && req.body.last_name && req.body.email && req.body.password) {
        var old_user = await model.User.findOne({ email: req.body.email});
        if(old_user) {
            res.send({
                error: 1,
                output: "user already exists",
            })
        } else {
            var new_user = new model.User({
                first_name: req.body.first_name, 
                last_name: req.body.last_name, 
                email: req.body.email,
                password: req.body.password,
            })
            
            new_user.save();

            res.send({
                error: 0,
                output: "user created",
            });
        }
    } else {
        res.send({
            error: 1,
            output: "user could not be created",
        });
    }
}

module.exports.edit = (req, res) => {
    if(!req.body.old_email && !req.body.new_email) {
        res.send({
            error: 1,
            output: "please provide valid information",
        })
    } else {
        var update = {};
        if(req.body.first_name) {
            update['first_name'] = req.body.first_name;
        } 
        if(req.body['last_name']) {
            update['last_name'] = req.body.last_name;
        }
        if(req.body.new_email) {
            update['email'] = req.body.new_email;
        }
        if(req.body.password) {
            update['password'] = req.body.password;
        }

        model.User.findOneAndUpdate({
            email: req.body.old_email,
        }, update).then(result => {
            res.send({
                error: 0,
                output: "document was updated",
            })
        }).catch(err => {
            res.send({
                error: 1,
                output: "document was not found",
            })
        })

    }
}

module.exports.view = (req, res)=>{
    if(!req.body.email) {
        res.send({
            error: 1,
            output: "provide email as parameter",
        })
    } else {
        model.User.findOne({
            email: req.body.email
        }).then(result => {
            if(result) {
                res.send({
                    error: 0,
                    output: "result was found",
                    data: result,
                })
            } else {
                res.send({
                    error: 1,
                    output: "result was not found",
                })
            }
        }).catch(err => {
            res.send({
                error: 1,
                output: "there was some error fetching the data",
            })
        })
    }
}