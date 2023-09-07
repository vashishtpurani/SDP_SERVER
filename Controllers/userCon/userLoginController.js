const {userModel} = require("../../Models/signInAuth/userModel")
const {Otp} = require("../../Models/signInAuth/otpModel")
const {dataModel} = require("../../Models/signInAuth/dataModel")
const otpGenerator = require("otp-generator")
const crypto = require("crypto")
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs')

const algorithm = process.env.ALGORITHM //algorithm to use
const secret = process.env.SECRET
const key = crypto.scryptSync(secret, 'salt', 24); //create key

const generateToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRETKEY )
}

module.exports.sendOtp = async (req,res)=>{
    try{
        const num = req.body.number
        const user = await dataModel.findOne({
            phoneNumber: num
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
        console.log("Generated otp for", number, "is :" + OTP, "and encrypted is", encrypted, "")
        console.log("Generated otp is :" + OTP)

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
        if (otpHolder.length === 0) return res.status(400).send("Incorrect Phone Number")
        const lastOtp = otpHolder.pop()
        console.log("last sent otp is : " + lastOtp.otp)
        console.log("Your entered otp is : " + req.body.otp)
        const valid = lastOtp.otp === req.body.otp || 1111 // TODO: change this before final app production
        console.log(valid)
        if (valid) {
            const user = await new userModel({number:num})
            const final =  user.save()
            const id = user._id
            const remove = await Otp.deleteMany({
                number: lastOtp.number
            })

            return res.status(200).json({message: "OK",token:generateToken(user._id), data: final, id})
        } else
            console.log("wrong")
        return res.status(400).json({message: "WRONG"})
    }catch (err){
        console.log(err)
    }

}
module.exports.signUp = async(req,res)=>{
    try{
        const {firstName,lastName,phoneNumber,password} = req.body

        const salt = await bcrypt.genSalt(10)
        const hashPass = await bcrypt.hash(password,salt)

        const sabe = new dataModel({
            firstName:firstName,
            lastName:lastName,
            phoneNumber:phoneNumber,
            password:hashPass
        })

        await sabe.save()
        res.status(200).send("User Generated")
    }catch (e) {
        console.log(e)
        res.send(e)
    }
}

module.exports.signIn = async (req,res)=>{
    try{
        const {number,password} = req.body
        const user = await dataModel.findOne({phoneNumber:number})
        // console.log(number,password,user)
        const staus = await bcrypt.compare(password,user.password)
        console.log(staus)
        if(user.length!==0 && (await bcrypt.compare(password,user.password))){
            console.log("USER FOUND")
            res.status(200).json({message:"User Found",
                _id : user.id,
                phoneNumber : user.phoneNumber,
                password: user.password,
                token: generateToken(user._id)
            })
        }
        else {
            res.status(400).json({message:"Wrong email or password"})
        }

    }catch (e){
        res.status(400).send(e)
    }
}
