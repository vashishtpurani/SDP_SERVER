const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const {dataModel} = require("../Models/signInAuth/dataModel")



const signinAuth = asyncHandler(async (req, res, next)=>{
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token,process.env.JWT_SECRETKEY,'' ,false)
            req.login = await dataModel.findById(decoded.id).select('-number')
            next()
            // console.log("called")
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

module.exports = {signinAuth}
