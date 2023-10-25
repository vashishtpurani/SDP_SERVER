const {Schema,model} = require('mongoose')
const mongoose = require("mongoose");

module.exports.chatReqModel = model('chatReqModel',Schema({
    users:{
        type:Schema.Types.ObjectId,
        ref: 'dataModel',
        required:true
    },
    advId:{
        type: Schema.Types.ObjectId,
        ref: 'advLoginModel',
        required:true
    }
},{timestamps:true}))
