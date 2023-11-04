const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const {msgModel} = require("../../Models/chatModels/msgModel");
const {advLoginModel} = require("../../Models/advModels/advLoginModel");
const {dataModel} = require("../../Models/signInAuth/dataModel");
const {chatModel} = require("../../Models/chatModels/chatModel");

module.exports.sendMsg = expressAsyncHandler(async (req,res)=>{
    try{
        const {data} = req.body
        const {id} = req.params
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token,process.env.JWT_SECRETKEY,'' ,false)

        if(!data||!id){
            return res.send("NO BULLSHIT")
        }
        let newMsg = {
            sender:decoded.id,
            content: data,
            chat:id
        }
        console.log(newMsg.sender)
        let msg = await new msgModel(newMsg)
        msg = await msg.populate("chat")

        let isLayer = await advLoginModel.find({_id:decoded.id})
        if(isLayer.length===0){
            let user = await dataModel.find({_id:decoded.id})
        }

        msg.save()
        await chatModel.findByIdAndUpdate(id,{
            latestMessage: msg
        })
        res.json(msg)
    }catch (e) {
        console.log(e)
    }
})

// module.exports.getMsgLaw = expressAsyncHandler(async (req, res)=>{
//     try{
//         const id = req.params.id
//
//         const token = req.headers.authorization.split(' ')[1]
//         const decoded = jwt.verify(token,process.env.JWT_SECRETKEY,'' ,false)
//
//         const msg = await msgModel.find({chat:id})
//         // console.log(msg)
//
//         let isLayer = await advLoginModel.find({_id:decoded.id},'advNum advName')
//         const abc = {...msg[0]._doc,...isLayer[0]._doc}
//         if(isLayer.length===0){
//             let user = await dataModel.find({_id:decoded.id},'firstName lastName phoneNumber')
//             const abc = {...msg[0]._doc,...user[0]._doc}
//             return res.send(abc)
//         }
//         res.send(msg)
//     }catch (e){
//         console.log(e)
//     }
// })

module.exports.getMsgLaw = expressAsyncHandler(async (req, res) => {
    try {
        const id = req.params.id;

        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRETKEY, '', false);

        const messages = await msgModel.find({ chat: id });

        if (messages.length === 0) {
            return res.status(404).send({ message: 'Messages not found' });
        }
        // console.log(messages)
        const userMessages = [];

        for (const message of messages) {
            const senderId = message.sender;
            // console.log(senderId)
            let user;


            let isAdvLayer = await advLoginModel.findById(senderId, 'advNum advName');

            if (isAdvLayer) {
                user = { ...message._doc, ...isAdvLayer._doc,user:false };
            } else {

                let isUser = await dataModel.findById(senderId, 'firstName lastName phoneNumber');

                if (isUser) {
                    user = { ...message._doc, ...isUser._doc,user:true };
                } else {
                    return res.status(404).send({ message: 'User not found' });
                }
            }

            userMessages.push(user);
        }

        res.send(userMessages);
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});
