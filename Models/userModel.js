const{Schema,model} = require("mongoose")
const jwt = require("jsonwebtoken")

const userModel = Schema({
    number:{
        type: String,
        require:true
    }
},{timestamps:true})

module.exports.userModel = model('userModel',userModel)
