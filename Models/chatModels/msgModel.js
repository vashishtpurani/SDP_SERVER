const {Schema,model} = require('mongoose')
const mongoose = require("mongoose");

module.exports.msgModel = model('msgModel',Schema({
    sender:{
        type:Schema.Types.ObjectId
    },
    content:[{
        type:String,
        trim:true
    }],
    chat:{
        type:Schema.Types.ObjectId,
        ref:"chatModel"
    }
},{timestamps:true}))
