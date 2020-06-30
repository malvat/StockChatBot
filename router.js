require('dotenv').config();
const express = require('express');
const router = express.Router();
const watson = require('./watson');

// Home request
router.get('/', (req, res)=>res.send(`Server is running at http://localhost:${process.env.PORT}`));

// send message
router.post('/', watson.message);

module.exports = router;