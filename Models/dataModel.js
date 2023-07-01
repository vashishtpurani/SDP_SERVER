const {Schema,model} = require('mongoose')

module.exports.dataModel = model('dataModel',Schema({
    firstName :{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required: true
    },
    phoneNumber:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    }
},{timestamps:true}))
