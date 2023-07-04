const {Schema,model} = require('mongoose')

module.exports.raiseQuery = model('raiseQuery',Schema({
    uId:{
        type:Schema.Types.ObjectId,
        required:true
    },
    query:{
        type:String,
        required: true
    },
    Classified:{
        type:String,
        required:true
    }
},{timestamps:true}))
