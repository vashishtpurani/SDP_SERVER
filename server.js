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
io.on("connection", (socket) => {
    console.log(`SOCKET CONNECTION ESTABLISHED : ${socket.id}`);

    socket.on("setup", (userData) => {
        // Assuming 'id' is defined somewhere
        id = userData;
        socket.join(id);
        socket.emit("KONNECTED");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("user joined room:", room);
    });

    socket.on("new message", (newMessageReceived) => {
        let chat = newMessageReceived.chat;
        console.log("advUser : ", newMessageReceived.chat._id);

        io.in(newMessageReceived.chat._id).emit("message received", newMessageReceived);
    });
});


/*assets
    https://www.altexsoft.com/blog/document-classification/
    https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2
    can I drive my two whealer listening to music
    can I drive my bike with headphones on
    I had an omelet for breakfast.
    bhavya:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YWMwNGRkOGYzMjdlZWUwMzEzMmFlYiIsImlhdCI6MTY5ODQyNDk3MX0.0W8hjxojqeBJpJwwtuGA4IzPNofSDJJ8Pyew1bVD7is
*/
