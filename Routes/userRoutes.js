const router = require('express').Router()
const {signUp,Verify, sendOtp, signIn} = require("../Controllers/userLoginController")
const {signupAuth} = require("../middleware/signupAuth")
const {signinAuth} = require("../middleware/signinAuth");
const {raiseQuery} = require("../Controllers/userQueryController")

//for user Auth
router.route('/sendOtp').post(sendOtp)
router.route('/verify').post(Verify)
router.route('/signUp').post(signupAuth,signUp)
router.route('/signIn').post(signIn)

//for queries
router.route('/raiseQuery').post(signinAuth,raiseQuery)

module.exports = router
