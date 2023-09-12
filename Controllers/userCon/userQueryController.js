const {raiseQueryModel} = require("../../Models/queryModels/raiseQueryModel")
const axios =  require("axios")
const jwt = require("jsonwebtoken");
const multer = require('multer')
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb()
    }
})
module.exports.raiseQuery = async(req,res)=>{
    try{
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token,process.env.JWT_SECRETKEY,'' ,false)
        const uId = decoded.id
        const {query} = req.body
        let Classs
        async function Classifier() {
            let response = await axios.post(
                'https://api-inference.huggingface.co/models/facebook/bart-large-mnli',
                {
                    "inputs": query,
                    "parameters": {"candidate_labels": ["civil","crime","matrimonial"]}
                },
                {headers: { Authorization: `Bearer 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` }}
            )
            return response.data;
        }
        await Classifier().then((e)=>{
            Classs = e.labels[0]
            console.log(Classs)
        });
        const Query = await new raiseQueryModel({uId:uId,query:query,Classified:Classs,Status:false})
        const data = await Query.save()
        console.log(data)
        res.send(data)
    }catch (e) {
        res.status(400).send(e)
        console.log(e)
    }
}
module.exports.fetchAll = async(rea,res)=>{
    try{
        const data = await raiseQueryModel.find()
        res.send(data)
    }catch (e) {
        console.log(e)
        res.send(e)
    }
}
module.exports.fetchUserAll = async(rea,res)=>{
    try{
        const data = await raiseQueryModel.find()
        res.send(data)
    }catch (e) {
        console.log(e)
        res.send(e)
    }
}

