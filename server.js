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
io.on("connection",(io)=>{
    console.log(`SOCKET CONNECTION EXTABLISHED : ${io.id}`)

    io.on("setup",(userData)=>{
        id = userData.id
        io.join(id)
        io.emit("KONNECTED")
        console.log("KONNECTED")
    })

    io.on("join chat",(room)=>{
        io.join(room)
        console.log("use joined room",room)
    })

    io.on("new message",(NMRe)=>{
        let chat = NMRe.chat;
    })
})


/*assets
    https://www.altexsoft.com/blog/document-classification/
    https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2
    can I drive my two whealer listening to music
    can I drive my bike with headphones on
    I had an omelet for breakfast.
*/
