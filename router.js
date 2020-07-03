require('dotenv').config();
const express = require('express');
const router = express.Router();
const watson = require('./watson');

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

module.exports = router;