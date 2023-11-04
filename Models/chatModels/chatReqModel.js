const {Schema,model} = require('mongoose')
const mongoose = require("mongoose");

module.exports.chatReqModel = model('chatReqModel',Schema({
    advId:{
        type: Schema.Types.ObjectId,
        ref: 'advLoginModel',
        required:true
    },
    users:{
        type:Schema.Types.ObjectId,
        ref: 'dataModel',
        required:true
    }
},{timestamps:true}))
