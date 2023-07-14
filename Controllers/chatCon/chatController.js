const AsyncHandler = require('express-async-handler')
const jwt = require("jsonwebtoken");
const {chatModel} = require("../../Models/chatModels/chatModel")
const {dataModel} = require("../../Models/signInAuth/dataModel");
const {advLoginModel} = require("../../Models/advModels/advLoginModel");

module.exports.accessChat = AsyncHandler(async (req,res)=>{
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token,process.env.JWT_SECRETKEY,'' ,false)
    // const userId = decoded.id
    const {userId} = req.body
    const {user2Id} = req.body
    console.log(user2Id)
    console.log(userId)
    let isChat = await chatModel.find({$and:[
            {users:{$elemMatch:{$eq:user2Id}}},
            {users:{$elemMatch:{$eq:userId}}}
        ]}).populate("users","-password").populate("latestMessage")
    isChat = await dataModel.populate(isChat,{
        path:"latestMessage.sender",
        select:"firstName lastName phoneNumber"
    })
    isChat = await advLoginModel.populate(isChat,{
        path:"latestMessage.sender",
        select:"advName advNum"
    })

    if(isChat.length>0){

        res.send({message:"chat found",data:isChat[0]})
    }else{
        let chatData = {
            chatName:"sender",
            users:[userId,user2Id]
        }
        try{
            const createdCreatedChat = await chatModel.create(chatData)
            console.log(chatData)
            let fullChat = await chatModel.findOne({_id:createdCreatedChat._id}).populate("users","-password")
            // fullChat = await advLoginModel.findOne({_id:createdCreatedChat._id}).populate("users","-password")
            res.send(fullChat)
        }catch (e) {
            console.log(e)
        }
    }
})
