require('dotenv').config();
const express = require('express');
const router = express.Router();
const watson = require('./watson');
const user_controller = require('./controller/user_controller');
const credit_controller = require('./controller/credit_controller');
const jwt = require('jsonwebtoken');

// input request for seding request messsage to watson
router.post('/input', (req, res)=> {
    res.send({
        "input": req.body.message,
    })
    console.log(req.body.message);
});

// Home request for testing if the api is working or not
router.get("/", (req, res) => {
    res.send({
        "working": true,
        "error": 0
    })
})


// send message
router.post('/', watson.message);

// middle ware for authentication
function auth(req, res, next) {
    console.log("working");
    var token = req.headers['x-access-token'];
    if(!token) {
        return res.status(401).send({
            auth: false, 
            message: "token is missing",
        })
    }

    jwt.verify(token, process.env.AUTH_SECRET_KEY, (err, decoded) => {
        if(err) {
            return res.status(401).send({
                auth: false, 
                message: "token not verified",
            })
        } else {
            next();
        }
    });
}

// user methods
router.post('/user/create', user_controller.create);
router.post('/user/edit', auth, user_controller.edit);
router.post('/user/view', user_controller.view);

// stock methods

// credit methods
router.post('/user/credit/add', credit_controller.add);
router.post('/user/credit/sub', credit_controller.sub);

module.exports = router;