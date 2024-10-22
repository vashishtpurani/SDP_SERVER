const express = require('express')
const app = express()
const cors = require("cors");
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser");

//importing all routes from Routes folder
const userRoutes = require("./Routes/userRoutes")
const advRoutes = require("./Routes/advRoutes")
const chatRoutes = require("./Routes/chatRoutes")
const msgRoutes = require("./Routes/msgRoutes")
const comRoutes = require("./Routes/comRoutes")

//enabling cross-reference policy for react connection
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET','POST','HEAD','PUT','PATCH','DELETE'],
    allowedHeaders: ['*'],
    exposedHeaders: ['Content-Type']
}))
app.use(cookieParser());

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

//enabling all the routes on their url
app.use("/user",userRoutes)
app.use("/law",advRoutes)
app.use("/chat",chatRoutes)
app.use("/msg",msgRoutes)
app.use("/com",comRoutes)

module.exports = app
