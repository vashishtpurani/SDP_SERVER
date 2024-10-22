require("dotenv/config")
const app = require('./app')
const mongoose = require('mongoose')
const {advLoginModel} = require("./Models/advModels/advLoginModel");
const {dataModel} = require("./Models/signInAuth/dataModel");


//TODO: change where you store secrets
//TODO: manage who can send messaging requests to lawyer
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

    socket.on("new message", async (newMessageReceived) => {
        let chat = newMessageReceived.chat
        console.log("advUser : ", newMessageReceived.chat._id)
        console.log(newMessageReceived)
        let id = newMessageReceived.sender
        let user

        const fun = async () => {
            let isAdvLayer = await advLoginModel.findById(id, 'advNum advName')
            if (isAdvLayer) {
                user = { ...newMessageReceived, ...isAdvLayer._doc, user: false };
            } else {
                let isUser = await dataModel.findById(id, 'firstName lastName phoneNumber');
                if (isUser) {
                    user = { ...newMessageReceived, ...isUser._doc, user: true };
                } else {
                    throw new Error('User not found');
                }
            }
            return user; // Return the user object
        }

        try {
            user = await fun(); // Await the result of the asynchronous function
            console.log(user);
            io.in(newMessageReceived.chat._id).emit("message received", user);
        } catch (error) {
            console.error(error);
            // Handle the error here
        }
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
