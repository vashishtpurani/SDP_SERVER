const {Schema,model} = require('mongoose')

module.exports.feedbackModel = model('feedbackModel',Schema({
    uId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"dataModel"
    },
    feedback:{
        type:String,
        required: true
    },
    qId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"raiseQueryModel"
    }
},{timestamps:true}))
