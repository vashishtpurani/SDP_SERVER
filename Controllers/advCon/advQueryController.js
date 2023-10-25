const jwt = require("jsonwebtoken");
const {advLoginModel} = require("../../Models/advModels/advLoginModel");
const {raiseQueryModel} = require("../../Models/queryModels/raiseQueryModel");
const {time} = require("@tensorflow/tfjs");

module.exports.reqQuery = async (req,res)=>{
    try{
        console.log(req.headers.authorization)
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token,process.env.JWT_SECRETKEY,'' ,false)

        const user = await advLoginModel.find({_id:decoded.id})
        const queries = await raiseQueryModel.find({Classified:user[0].advClass,Status:false})
        console.log(queries)

        res.json({data: queries})
    }catch (e) {
        console.log(e)
    }
}
//TODO:this is depricated verion of the api where we are not handeling the promise by mongoose find method properly
// module.exports.ansQuery = async(req,res)=>{
//     try{
//         const {Ans,id} = req.body
//
//         const token = req.headers.authorization.split(' ')[1]
//         const decoded = jwt.verify(token,process.env.JWT_SECRETKEY,'' ,false)
//         // console.log(req.body)
//         const answered = raiseQueryModel.find({_id:id,'Ans': { $elemMatch: { 'advId': decoded.id }}}).exec()
//             .then(async (data)=>{
//             console.log(data)
//             if(data.length===0){
//                 await raiseQueryModel.findByIdAndUpdate(id, {$push:{Ans: {advId:decoded.id,$push: { 'Ans.$.ANS': Ans }}},Status:true},{new:true})
//                 return res.status(200).json({message:"NEW SUCCESSFUL"})
//             }else {
//                 await raiseQueryModel.updateOne({_id:id,'Ans': { $elemMatch: { 'advId': decoded.id } }}, { $push: { 'Ans.$.ANS': Ans } },{Status:true},{new:true})
//                 await raiseQueryModel.updateOne({_id:id,'Ans': { $elemMatch: { 'advId': decoded.id } }},{Status:true},{new:true})
//                 return res.status(200).json({message:"OLD SUCCESSFUL"})
//             }
//         })
//
//         console.log(answered)
//     }catch (e) {
//         console.log(e)
//     }
// }
module.exports.ansQuery = async (req, res) => {
    try {
        const { Ans, id } = req.body;

        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRETKEY, '', false);

        const data = await raiseQueryModel.find({
            _id: id,
            'Ans': { $elemMatch: { 'advId': decoded.id } }
        }).exec();

        console.log(data);
        const currentTime = Date.now();
        if (data.length === 0) {
            await raiseQueryModel.findByIdAndUpdate(id, { $push: { Ans: { advId: decoded.id, ANS: {ans: Ans,time:currentTime} } }, Status: true }, { new: true });
            return res.status(200).json({ message: "NEW SUCCESSFUL" });
        } else {
            await raiseQueryModel.updateOne({ _id: id, 'Ans': { $elemMatch: { 'advId': decoded.id } } }, { $push: { 'Ans.$.ANS': {ans: Ans,time:currentTime} }, Status: true }, { new: true });
            return res.status(200).json({ message: "OLD SUCCESSFUL" });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

