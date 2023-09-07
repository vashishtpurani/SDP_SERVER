const {dumAdv} = require("../../Models/advModels/dumAdv")
const {advLoginModel} = require("../../Models/advModels/advLoginModel");
const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs')
const {dataModel} = require("../../Models/signInAuth/dataModel");
const {raiseQueryModel} = require("../../Models/queryModels/raiseQueryModel");

const createToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRETKEY ,"","")
}

module.exports.signUp = async (req,res)=>{
    try{
        const {advNum} = req.body
        const valid = await dumAdv.find({advNum:advNum,advStatus:true})
        const valid2 = await advLoginModel.find({advNum:advNum})

        console.log(valid)
        if(valid.length!==0 && valid2.length!==0){
            return res.send("ALREADY REGISTERED")
        }
        if(valid.length===0){
            return res.send("NOT VALID")
        }
        if(valid.length!==0&&valid2===0){
            const {advName,advClass,advPass} = req.body
            const salt = await bcrypt.genSalt(10)
            const hashPass = await bcrypt.hash(advPass,salt)

            const doc = await new advLoginModel({advNum:advNum ,advName:advName,advClass:advClass,advPass:hashPass})
            await doc.save()
            return res.status(200).json({message: "VALID LAWYER"})
        }
    }catch (e){
        console.log(e)
        res.send(e)
    }
}

module.exports.signIn = async(req,res)=>{
    try{
        const {advNum,advPass} = req.body
        const user = await advLoginModel.findOne({advNum:advNum})
        console.log(user)
        const status = await bcrypt.compare(advPass,user.advPass)
        console.log(status)
        if(user && (await bcrypt.compare(advPass,user.advPass))){
            console.log("USER FOUND")
            res.status(200).json({message:"User Found",
                token: createToken(user._id)
            })
        }
        else {
            res.status(400).json({message:"Wrong email or password"})
        }

    }catch (e){
        res.status(400).send(e)
    }
}
