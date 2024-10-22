const {raiseQueryModel} = require("../../Models/queryModels/raiseQueryModel")
const axios =  require("axios")
const jwt = require("jsonwebtoken")
const multer = require('multer')
const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs');
const use = require('@tensorflow-models/universal-sentence-encoder');
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb()
    }
})
let model
async function Classifier(query) {
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
async function calculateSimilarity(sentence1, sentence2) {
    if (!model) {
        model = await use.load();
    }

    const embeddings = await model.embed([sentence1, sentence2])

    const similarity = tf.dot(embeddings.arraySync()[0], embeddings.arraySync()[1])

    return similarity
}

module.exports.sentenceSimilarity = async(req,res)=>{
    try{
        // const token = req.headers.authorization.split(' ')[1]
        // const decoded = jwt.verify(token,process.env.JWT_SECRETKEY,'' ,false)
        // const uId = decoded.id
        const {query} = req.body
        console.log(req.body)
        let Classs
        await Classifier(query).then((e)=>{
            Classs = e.labels[0]
            console.log(Classs)
        });
        const queries = await raiseQueryModel.find( {Classified:Classs})
        console.log(queries)
        const results = []
        for (const dbQuery of queries) {
            const similarityTensor = await calculateSimilarity(query, dbQuery.query)
            const similarity = similarityTensor.arraySync();

            console.log(`Similarity with query (${dbQuery._id}): ${similarity}`)
            if(similarity>=0.5){
                results.push(dbQuery)
            }
        }
        console.log(results)
        // if(results.length===0){
        //     const Query = await new raiseQueryModel({uId:uId,query:query,Classified:Classs,Status:false})
        //     const data = await Query.save()
        // }
        res.json({message:"UwU",data:results,status:200,classs:Classs})
    }catch (e) {
        console.log(e)
    }
}
module.exports.raiseQuery = async(req,res)=>{
    try{
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token,process.env.JWT_SECRETKEY,'' ,false)
        const uId = decoded.id
        const {query,Classs} = req.body

        console.log(req.body)

        const Query = await new raiseQueryModel({uId:uId,query:query,Classified:Classs,Status:false})
        const data = await Query.save()
        console.log(data)
        res.send(data)
    }catch (e) {
        res.status(400).send(e)
        console.log(e)
    }
}
module.exports.fetchAll = async (req, res) => {
    try {
        const queries = await raiseQueryModel.find().populate({
            path: 'Ans.advId',
            model: 'advLoginModel',
            select: 'name', // Assuming the lawyer's name is in the 'name' field
        }).exec();

        // Extract only the necessary information for the response
        const simplifiedData = queries.map(async (item) => {
            const populatedItem = await raiseQueryModel.findById(item._id).populate({
                path: 'Ans.advId',
                model: 'advLoginModel',
                select: 'advName',
            });
            return {
                id: populatedItem._id,
                uId: populatedItem.uId,
                query: populatedItem.query,
                Classified: populatedItem.Classified,
                Status: populatedItem.Status,
                Ans: populatedItem.Ans.map(answer => ({
                    id:answer.advId,
                    lawyerName: answer.advId.advName,
                    ANS:answer.ANS
                })),
                upVote: populatedItem.upVote.map(up=>up),
                downVote: populatedItem.downVote.map(down=>down),
                createdAt: populatedItem.createdAt,
                updatedAt: populatedItem.updatedAt
            };
        });
        Promise.all(simplifiedData)
            .then(data => res.status(200).json(data))
            .catch(error => {
                console.error(error);
                res.status(500).json({ message: 'Internal Server Error' });
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
module.exports.fetchUserAll = async(req,res)=>{
    try{
        // console.log(req.headers)
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token,process.env.JWT_SECRETKEY,'' ,false)
        const uId = decoded.id
        const queries = await raiseQueryModel.find({uId:uId}).populate({
            path: 'Ans.advId',
            model: 'advLoginModel',
            select: 'name', // Assuming the lawyer's name is in the 'name' field
        }).exec();

        // Extract only the necessary information for the response
        const simplifiedData = queries.map(async (item) => {
            const populatedItem = await raiseQueryModel.findById(item._id).populate({
                path: 'Ans.advId',
                model: 'advLoginModel',
                select: 'advName',
            });


            return {
                id: populatedItem._id,
                uId: populatedItem.uId,
                query: populatedItem.query,
                Classified: populatedItem.Classified,
                Status: populatedItem.Status,
                Ans: populatedItem.Ans.map(answer => ({
                    id:answer.advId._id,
                    lawyerName: answer.advId.advName,
                    ANS:answer.ANS
                })),
                upVote: populatedItem.upVote.map(up=>up),
                downVote: populatedItem.downVote.map(down=>down),
                createdAt: populatedItem.createdAt,
                updatedAt: populatedItem.updatedAt
            };
        });
        Promise.all(simplifiedData)
            .then(data => res.status(200).json(data))
            .catch(error => {
                console.error(error);
                res.status(500).json({ message: 'Internal Server Error' });
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
module.exports.reopenQuery = async(req,res)=>{
    try{
        const {id} = req.params
        console.log(id)
        const query = await raiseQueryModel.findByIdAndUpdate(
            id,
            { $set: { Status: false } },
            { new: true, useFindAndModify: false }
        )
        console.log("opened")
        res.json({status:200,message:"Opened"})
    }catch (e){
        console.log(e)
    }

}

module.exports.filterQuery = async (req,res)=>{
    try{
        const {filter} = req.params
        const data = await raiseQueryModel.find({Classified:filter})

        res.send({message:"OK",data:data,status:200});

    }catch (e) {
        console.log(e)
    }
}
module.exports.getOne = async (req,res)=>{
    try{
        const {id} = req.params
        console.log(id)
        const data = await raiseQueryModel.find({_id:id})

        res.send({message:"OK",data:data,status:200});

    }catch (e) {
        console.log(e)
    }
}

module.exports.upVote = async (req,res)=>{
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token,process.env.JWT_SECRETKEY,'' ,false)
        const uId = decoded.id

        const {queryId} = req.params

        const ifDown = await raiseQueryModel.findOne({ _id: queryId, downVote: uId })
        const ifUp = await raiseQueryModel.findOne({ _id: queryId, upVote: uId })

        if(ifDown){
            ifDown.downVote.pull(uId)
            ifDown.upVote.push(uId)
            const newDoc = await ifDown.save();
            res.send({status:200,data:newDoc,message: 'DownVote changed to upVote'})
        }else if(ifUp){
            ifUp.upVote.pull(uId)
            const newDoc = await ifUp.save()
            res.send({status:200,data:newDoc,message: 'UpVote Removed Successfully'})
        }else{
            const updatedQuery = await raiseQueryModel.findByIdAndUpdate(
                queryId,
                 { upVote: uId } ,
                { new: true }
            )
            res.status(200).json({ message: 'UpVote added successfully', query: updatedQuery });
        }
    }catch (e) {
        console.log(e)
    }
}

module.exports.downVote = async (req,res)=>{
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token,process.env.JWT_SECRETKEY,'' ,false)
        const uId = decoded.id

        const {queryId} = req.params

        const ifDown = await raiseQueryModel.findOne({ _id: queryId, downVote: uId })
        const ifUp = await raiseQueryModel.findOne({ _id: queryId, upVote: uId })

        if(ifDown){
            ifDown.downVote.pull(uId)
            const newDoc = await ifDown.save();
            res.send({status:200,data:newDoc, message: 'DownVote Removed'})
        }else if(ifUp){
            ifUp.upVote.pull(uId)
            ifUp.downVote.push(uId)
            const newDoc = await ifUp.save()
            res.send({status:200,data:newDoc,message: 'UpVote Changed to downVote'})
        }else{
            const updatedQuery = await raiseQueryModel.findByIdAndUpdate(
                queryId,
                 { downVote: uId } ,
                { new: true }
            )
            res.status(200).json({ message: 'downVote added successfully', query: updatedQuery });
        }
    }catch (e) {
        console.log(e)
    }
}
