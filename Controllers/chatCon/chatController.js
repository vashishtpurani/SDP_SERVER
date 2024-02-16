const AsyncHandler = require('express-async-handler')
const jwt = require("jsonwebtoken");

const {chatModel} = require("../../Models/chatModels/chatModel")
const {dataModel} = require("../../Models/signInAuth/dataModel");
const {advLoginModel} = require("../../Models/advModels/advLoginModel");
const expressAsyncHandler = require("express-async-handler");
const {chatReqModel} = require("../../Models/chatModels/chatReqModel");

module.exports.reqCom = async(req,res)=>{
    try{
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token,process.env.JWT_SECRETKEY,'' ,false)
        const userId = decoded.id

        const {advId} = req.params


        const exists = await chatReqModel.find({users:userId,advId:advId})
        if(exists.length!==0){
            console.log("LOFANOSNIDANDIOSANIDONAOSNDOIANSIDONASOID")
            res.send({message:"already a friend"})
        }else{
            const data = await new chatReqModel({
                users:userId,
                advId:advId
            })
            await data.save()
            res.send({status:200,message:"created",data:data})
        }

    }catch (e) {
        res.send(e)
        console.log(e)
    }
}
module.exports.getCom = async(req,res)=>{
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token,process.env.JWT_SECRETKEY,'' ,false)
        const userId = decoded.id

        const data = await chatReqModel.find({advId:userId})
        res.send({message:"OK",data:data,status:200})
    }catch (e){
        console.log(e)
    }
}
module.exports.acceptCom = async(req,res)=>{
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token,process.env.JWT_SECRETKEY,'' ,false)
        const userId = decoded.id
        const id = req.params.id

        let chatData = {
            chatName:"sender",
            users:id ,
            advUsers:userId
        }
        try{
            const createdCreatedChat = await chatModel.create(chatData)
            console.log(chatData)
            let fullChat = await chatModel.findOne({_id:createdCreatedChat._id})
                .populate({ path: 'users', select: '-password'})
                .populate({ path: 'advUsers', select: '-advPass'})
            const remove = await chatReqModel.findOneAndDelete({users:id})
            res.send(fullChat)
        }catch (e) {
            console.log(e)
        }
    }catch (e){
        console.log(e)
    }
}
module.exports.accessChat = AsyncHandler(async (req,res)=>{
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token,process.env.JWT_SECRETKEY,'' ,false)
    const advId = decoded.id
    const {user2Id} = req.body
    console.log(user2Id)
    console.log(advId)
    let isChat = await chatModel.find({$and:[
            {users:{$eq:advId}},
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
            users:advId,
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
// module.exports.fetchChats = expressAsyncHandler(async (req,res)=>{
//     try{
//         const {id} = req.body
//         chatModel.find({user: {$eq:id}})
//             .populate({path:'users',select:'firstName lastName phoneNumber'})
//             .populate("latestMessage")
//             .sort({updatedAt:-1})
//             .then(async (result)=>{
//                 result = await dataModel.populate(result, {
//                     path:"latestMessage.sender",
//                     select: "firstName lastName"
//                 }).then(async(a)=>{
//                     let abc = await advLoginModel.find({_id:result[0].advUsers},'-advPass')
//                     a = a[0]._doc
//                     abc = abc[0]._doc
//                     const hehe = {...a,...abc}
//                     console.log(a,abc)
//                     res.status(200).send(hehe)
//                 })
//             })
//     }catch (e) {
//         console.log(e)
//     }
// })
module.exports.fetchChats = expressAsyncHandler(async (req, res) => {
    try {
        const { id } = req.body;
        console.log(id)
        const result = await chatModel.find({ users: { $eq: id } })
            .populate({ path: 'users', select: 'firstName lastName phoneNumber' })
            .populate("latestMessage")
            .sort({ updatedAt: -1 });

        if (result.length === 0) {
            return res.status(404).send({ message: 'Chats not found' });
        }

        const populatedResult = await dataModel.populate(result, {
            path: "latestMessage.sender",
            select: "firstName lastName"
        });

        if (!populatedResult || populatedResult.length === 0) {
            return res.status(404).send({ message: 'Chats not found' });
        }

        const advUser = await advLoginModel.findById(result[0].advUsers, '-advPass');

        if (!advUser) {
            return res.status(404).send({ message: 'Adv user not found' });
        }

        const hehe = { ...populatedResult[0]._doc, ...advUser._doc };
        // console.log(hehe);
        res.status(200).send(hehe);
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

module.exports.fetchChatsLaw = expressAsyncHandler(async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token,process.env.JWT_SECRETKEY,'' ,false)
        const id = decoded.id
        console.log(id);

        const results = await chatModel.find({ advUsers: { $eq: id } })
            .populate({ path: 'users', select: 'firstName lastName phoneNumber' })
            .populate("latestMessage")
            .sort({ updatedAt: -1 });

        if (results.length === 0) {
            return res.status(404).send({ message: 'Chats not found' });
        }

        const combinedResults = [];

        for (const result of results) {
            const populatedResult = await dataModel.populate(result, {
                path: "latestMessage.sender",
                select: "firstName lastName"
            });

            if (!populatedResult) {
                continue; // Skip if no populated result
            }

            const hehe = { ...populatedResult._doc, ...result._doc };
            combinedResults.push(hehe);
        }
        const adv = await advLoginModel.findById(id,'-advPass')

        // console.log(combinedResults);
        res.status(200).send(combinedResults);
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: 'Internal Server Error' });
    }
})

module.exports.fetchChatsUser = expressAsyncHandler(async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token,process.env.JWT_SECRETKEY,'' ,false)
        const id = decoded.id
        console.log(id);

        const results = await chatModel.find({ users: { $eq: id } })
            .populate({ path: 'advUsers', select: 'advName advClass' })
            .populate("latestMessage")
            .sort({ updatedAt: -1 });

        if (results.length === 0) {
            return res.status(404).send({ message: 'Chats not found' });
        }

        const combinedResults = [];

        for (const result of results) {
            const populatedResult = await advLoginModel.populate(result, {
                path: "latestMessage.sender",
                select: "advName advClass"
            });

            if (!populatedResult) {
                continue; // Skip if no populated result
            }

            const hehe = { ...populatedResult._doc, ...result._doc };
            combinedResults.push(hehe);
        }
        const adv = await dataModel.findById(id,'-password')

        // console.log(combinedResults);
        res.status(200).send(combinedResults);
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: 'Internal Server Error' });
    }
})
