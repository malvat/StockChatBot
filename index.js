require('dotenv').config()
const express = require('express')
const app = express()
const router = require('./router')
const bodyParser = require('body-parser');

app.use('/', router);
app.use(bodyParser.json()); 
app.listen(process.env.PORT, ()=>console.log(`Server is running at http://localhost:${process.env.PORT}`))