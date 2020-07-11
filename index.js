require('dotenv').config()
const express = require('express')
const app = express()
const router = require('./router')
const bodyParser = require('body-parser');
var session = require('express-session');
const mongoose = require('mongoose');

/**
 * 
 */
const sess = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}

mongoose.connect("mongodb://localhost/example", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
});

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);

app.use(session(sess));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
})

app.use('/', router);


app.listen(process.env.PORT, ()=>console.log(`Server is running at http://localhost:${process.env.PORT}`))