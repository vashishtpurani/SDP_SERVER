const {Schema,model} = require('mongoose')

module.exports.advLoginModel = model('advLoginModel',Schema({
    advNum:{
        type:String,
        required:true
    },
    advName:{
        type:String,
        required: true
    },
    advClass:{
        type:String,
        required: true
    },
    advPass:{
        type:String,
        required: true
    }
},{timestamps:true}))
