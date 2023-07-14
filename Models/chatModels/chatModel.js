const {Schema,model} = require('mongoose')
const mongoose = require("mongoose");

module.exports.chatModel = model('chatModel',Schema({
    chatName:{
        type:String,
        trim:true
    },
    users:[{
        type:Schema.Types.ObjectId,
        ref:['dataModel','advLoginModel']
    }],
    latestMessage:{
        type:Schema.Types.ObjectId,
        ref:"msgModel"
    }
},{timestamps:true}))
