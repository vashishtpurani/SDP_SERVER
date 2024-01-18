const {Schema,model} = require('mongoose')

module.exports.raiseQueryModel = model('raiseQueryModel',Schema({
    uId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"dataModel"
    },
    query:{
        type:String,
        required: true
    },
    Classified:{
        type:String,
        required:true
    },
    Status:{
        type:Boolean,
        required:true
    },
    Ans:[{
        advId:{
            type:Schema.Types.ObjectId,
            required:true,
            ref:"advLoginModel"
        },
        ANS:[{
            ans:String,
            time:Date
        }]
    }],
    upVote:[{
        type:Schema.Types.ObjectId,
        ref:"dataModel"
    }],
    downVote:[{
        type:Schema.Types.ObjectId,
        ref:"dataModel"
    }]
},{timestamps:true}))
