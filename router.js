require('dotenv').config();
const express = require('express');
const router = express.Router();
const watson = require('./watson');
const user_controller = require('./controller/user_controller');

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


// user methods
router.post('/user/create', user_controller.create);
router.post('/user/edit', user_controller.edit);
router.post('/user/view', user_controller.view);

module.exports = router;