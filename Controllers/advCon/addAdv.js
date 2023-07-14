const {dumAdv} = require("../../Models/advModels/dumAdv")
module.exports.addAdv = async(req,res)=>{
    try{
        const {advNum, advStatus} = req.body
        const bool = advStatus === "true"
        const data = await new dumAdv({advNum: advNum, advStatus: bool})
        console.log(req.body)
        await data.save()
        res.status(200).json({message: "User Created", data: data})
    }catch (e) {
        console.log(e)
        res.send(e)
    }
}
module.exports.getAdv = async(req,res)=>{
    try{
        const data = await dumAdv.find()
        res.send(data)
    }catch (e) {
        console.log(e)
        res.send(e)
    }
}
