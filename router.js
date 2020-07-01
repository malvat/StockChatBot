require('dotenv').config();
const express = require('express');
const router = express.Router();
const watson = require('./watson');

// Home request
router.post('/input', (req, res)=> {
    res.send({
        "input": req.body.message,
    })
    console.log(req.body.message);
});



// send message
router.post('/', watson.message);

module.exports = router;