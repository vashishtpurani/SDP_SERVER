const {Schema,model} = require('mongoose')

module.exports.dumAdv = model('dumAdv',Schema({
    advNum:{
        type:String,
        required:true
    },
    advStatus:{
        type:Boolean,
        required: true
    }
},{timestamps:true}))
