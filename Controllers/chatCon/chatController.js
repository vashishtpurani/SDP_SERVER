const AsyncHandler = require('express-async-handler')
const jwt = require("jsonwebtoken");

const {chatModel} = require("../../Models/chatModels/chatModel")
const {dataModel} = require("../../Models/signInAuth/dataModel");
const {advLoginModel} = require("../../Models/advModels/advLoginModel");
const expressAsyncHandler = require("express-async-handler");

module.exports.accessChat = AsyncHandler(async (req,res)=>{
    // const token = req.headers.authorization.split(' ')[1]
    // const decoded = jwt.verify(token,process.env.JWT_SECRETKEY,'' ,false)
    // const userId = decoded.id
    const {userId} = req.body
    const {user2Id} = req.body
    console.log(user2Id)
    console.log(userId)
    let isChat = await chatModel.find({$and:[
            {users:{$eq:userId}},
            {advUsers:{$eq:user2Id}}
        ]})
        .populate({ path: 'users', select: '-password'})
        .populate({ path: 'advUsers', select: '-advPass'})
        .populate("latestMessage").exec()
    //
    // isChat = await dataModel.populate(isChat,{
    //     path:"latestMessage.sender",
    //     select:"firstName lastName phoneNumber"
    // })
    // isChat = await advLoginModel.populate(isChat,{
    //     path:"latestMessage.sender",
    //     select:"advName advNum"
    // })

    if(isChat.length>0){
        res.send({message:"chat found",data:isChat[0]})
    }else{
        let chatData = {
            chatName:"sender",
            users:[userId],
            advUsers:user2Id
        }
        try{
            const createdCreatedChat = await chatModel.create(chatData)
            console.log(chatData)
            let fullChat = await chatModel.findOne({_id:createdCreatedChat._id})
                .populate({ path: 'users', select: '-password'})
                .populate({ path: 'advUsers', select: '-advPass'})
            res.send(fullChat)
        }catch (e) {
            console.log(e)
        }
    }
})
module.exports.fetchChats = expressAsyncHandler(async (req,res)=>{
    try{
        const {id} = req.body
        chatModel.find({user: {$eq:id}})
            .populate({path:'users',select:'firstName lastName phoneNumber'})
            .populate("latestMessage")
            .sort({updatedAt:-1})
            .then(async (result)=>{
                result = await dataModel.populate(result, {
                    path:"latestMessage.sender",
                    select: "firstName lastName"
                }).then(async(a)=>{
                    let abc = await advLoginModel.find({_id:result[0].advUsers},'-advPass')
                    a = a[0]._doc
                    abc = abc[0]._doc
                    const hehe = {...a,...abc}
                    console.log(a,abc)
                    res.status(200).send(hehe)
                })
            })
    }catch (e) {
        console.log(e)
    }
})
