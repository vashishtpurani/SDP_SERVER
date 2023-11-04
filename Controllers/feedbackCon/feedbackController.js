const {feedbackModel} = require('../../Models/feedbackModels/feedbackModel')
const jwt = require("jsonwebtoken");
const axios = require("axios");

async function Classifier(query) {
    let response = await axios.post(
        'https://api-inference.huggingface.co/models/facebook/bart-large-mnli',
        {
            "inputs": query,
            "parameters": {"candidate_labels": ["positive","negative","neutral"]}
        },
        {headers: { Authorization: `Bearer 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` }}
    )
    return response.data;
}

module.exports.crtFeedback = async(req,res)=>{
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRETKEY, '', false);
        const uId = decoded.id
        const {feedbackText,ratings,qId,advId} = req.body

        console.log(req.body)
        let Classs
        await Classifier(feedbackText).then((e)=>{
            Classs = e.labels[0]
            console.log(Classs)
        })

        const data = {uId:uId,feedback:feedbackText,classified:Classs,ratings:ratings,qId:qId,advId:advId}
        console.log(Classs)
        const abc = await new feedbackModel(data)
        await abc.save()

        res.send({message:"OK",status:200,date:data})
    }catch (e){
        console.log(e)
    }
}
module.exports.getFeedbacksLa = async (req,res)=> {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRETKEY, '', false);
        const id = decoded.id

        const feedbacks = await feedbackModel.find({advId:id})

        res.send({status:200,message:"OK",data:feedbacks})
    }catch (e) {
        console.log(e)
    }
}
