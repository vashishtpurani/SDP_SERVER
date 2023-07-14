const express = require('express')
const app = express()
const cors = require("cors");
const bodyParser = require('body-parser')

const userRoutes = require("./Routes/userRoutes")
const advRoutes = require("./Routes/advRoutes")
const chatRoutes = require("./Routes/chatRoutes")
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET','POST','HEAD','PUT','PATCH','DELETE'],
    allowedHeaders: ['Content-Type'],
    exposedHeaders: ['Content-Type']
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.use("/user",userRoutes)
app.use("/law",advRoutes)
app.use("/chat",chatRoutes)
module.exports = app
