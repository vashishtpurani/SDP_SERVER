const {raiseQuery} = require("../Models/queryModels/raiseQuery")
const axios =  require("axios")
module.exports.raiseQuery = async(req,res)=>{
    try{
        const {uId,query} = req.body
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
        let abc = await Classifier().then((e)=>{
            Classs = e.labels[0]
            console.log(Classs)
        })
        const Query = new raiseQuery({uId:uId,query:query,Classified:Classs})
        const data = await Query.save()
        console.log(data)
        res.send(data)
    }catch (e) {
        res.status(400).send(e)
        console.log(e)
    }
}
