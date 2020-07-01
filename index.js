require('dotenv').config()
const express = require('express')
const app = express()
const router = require('./router')
const bodyParser = require('body-parser');
var session = require('express-session');


const sess = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);

app.use(session(sess));

app.use('/', router);
app.listen(process.env.PORT, ()=>console.log(`Server is running at http://localhost:${process.env.PORT}`))