require("dotenv/config")
const bodyParser = require('body-parser')
const app = require('./app')
const mongoose = require('mongoose')



mongoose.connect(process.env.MONGODB_URL_LOCAL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    dbName:"SDP"
}).then(()=>{
    console.log("connection established to DBS!!!!")
})

const port = process.env.PORT || 3000

app.listen(port,()=>{
    console.log(`Server hosted successfully at ${port}`)
})
