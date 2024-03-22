const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const {advLoginModel} = require("../Models/advModels/advLoginModel");




const advLoginAuth = asyncHandler(async (req, res, next)=>{
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token,process.env.JWT_SECRETKEY,'' ,false)
            req.login = await advLoginModel.findById(decoded.id).select('-number')
            next()
        }catch (error){
            console.log(error)
            res.status(401)
            throw new Error("not Authorised")
        }
    }
    if(!token){
        res.status(401)
    }
})

module.exports = {advLoginAuth}
