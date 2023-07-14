require("dotenv/config")
const app = require('./app')
const mongoose = require('mongoose')


//TODO: change where you store secrets

mongoose.connect(process.env.MONGODB_URL_LOCAL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    dbName:"SDP"
}).then(()=>{
    console.log("connection established to DBS!!!!")
})

const port = process.env.PORT || 5000

const server = app.listen(port,()=>{
    console.log(`Server hosted successfully at ${port}`)
})


//socket connection
const io = require('socket.io')(server,{
    pingTimeout:60000,
    cors:{
        origin:"*"
    }
})
let id
io.on("connection",(skt)=>{
    console.log(`SOCKET CONNECTION EXTABLISHED : ${skt.id}`)

    io.on("setup",(userData)=>{
        id = userData.id
        io.join(id)
        io.emit("KONNECTED")
        console.log("KONNECTED")
    })

    io.on("join chat",(userData)=>{
        io.join(userData.id)
        io.emit("KONNECTED")
        console.log("KONNECTED")
    })
})


/*assets
    https://www.altexsoft.com/blog/document-classification/
    can I drive my who whealer listening to music
    can I drive my bike with headphones on
*/
