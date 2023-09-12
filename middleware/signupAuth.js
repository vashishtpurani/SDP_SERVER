const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const {userModel} = require("../Models/signInAuth/userModel")



const signupAuth = asyncHandler(async (req, res, next)=>{
    let token
    console.log("asdasdasdasdasdasdasdasdasd")
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token,process.env.JWT_SECRETKEY,'' ,false)
            req.login = await userModel.findById(decoded.id).select('-number')
            console.log("authortewerw")
            next()
        }catch (error){
            console.log(error)
            res.status(401)
            throw new Error("not Authorised")
        }
    }
    if(!token){
        res.status(401)
        throw new Error("no token")
    }
})

module.exports = {signupAuth}
