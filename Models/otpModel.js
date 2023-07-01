const {Schema,model} = require('mongoose')

module.exports.Otp = model('otp',Schema({
    number :{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required: true
    },
    createdAt: {type:Date,default:Date.now,index:{expiresIn: 60}}
},{timestamps:true}))
