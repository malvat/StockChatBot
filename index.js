require('dotenv').config()
const express = require('express')
const app = express()

app.get("/", (req, res) => res.send(`Server is running at http://localhost:${process.env.PORT}`))

app.listen(process.env.PORT, ()=>console.log(`Server is running at http://localhost:${process.env.PORT}`))