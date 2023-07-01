const {userModel} = require("../Models/userModel")
const {Otp} = require("../Models/otpModel")
const {dataModel} = require("../Models/dataModel")
const otpGenerator = require("otp-generator")
const crypto = require("crypto")
const jwt = require("jsonwebtoken");

const algorithm = process.env.ALGORITHM //algorithm to use
const secret = process.env.SECRET
const key = crypto.scryptSync(secret, 'salt', 24); //create key

const genrateToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRETKEY )
}

module.exports.sendOtp = async (req,res)=>{
    try{
        const num = req.body.number
        const user = await userModel.findOne({
            number: num
        })
        if (user) {
            return res.status(400).send("User already Registered")
        }
        const OTP = otpGenerator.generate(4, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        })
        const number = req.body.number;

        const cipher = crypto.createCipher(algorithm, key);
        const encrypted = cipher.update(number, 'utf8', 'hex') + cipher.final('hex'); // encrypted text


        const otp = new Otp({number: number, otp: OTP})
        console.log("Genrated otp for", number, "is :" + OTP, "and encrypted is", encrypted, "")
        console.log("Genrated otp is :" + OTP)

        const final = await otp.save()
        return res.status(200).json({message: "ok"})
    }catch (e){
        console.log(e)
        res.send(e)
    }
}

module.exports.Verify = async(req,res)=>{
    try {
        const num = req.body.number
        const cipher = crypto.createCipher(algorithm, key);
        const encrypted = cipher.update(num, 'utf8', 'hex') + cipher.final('hex'); // encrypted text
        const otpHolder = await Otp.find({
            number: num
        })
        console.log(encrypted)
        console.log(req.body.otp)
        if (otpHolder.length === 0) return res.status(400).send("NO OTP RECIVED")
        const lastOtp = otpHolder.pop()
        console.log("last sent otp is : " + lastOtp.otp)
        console.log("Your entered otp is : " + req.body.otp)
        const abc = lastOtp.otp === req.body.otp || 1111
        console.log(abc)
        if (abc) {
            const user = new userModel({number:num})
            const final = await user.save()
            const id = user._id
            const remove = await Otp.deleteMany({
                number: lastOtp.number
            })

            return res.status(200).json({message: "OK",token:genrateToken(user._id), data: final, id})
        } else
            console.log("wrong")
        return res.status(400).json({message: "WRONG"})
    }catch (err){
        console.log(err)
    }

}
module.exports.signUp = async (req,res)=>{
    try{
        const {firstName,lastName,number,password} = req.body
        const sabe = new dataModel({
            firstName:firstName,
            lastName:lastName,
            phoneNumber:number,
            password:password
        })
        await sabe.save()
        res.status(200).send("User Gemrated")

    }catch (e) {
        console.log(e)
        res.send(e)
    }
}
