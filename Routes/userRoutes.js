const router = require('express').Router()
const {signUp,Verify, sendOtp, signIn} = require("../Controllers/userController")
const {signupAuth} = require("../middleware/signupAuth")
const {signinAuth} = require("../middleware/signinAuth");

router.route('/sendOtp').post(sendOtp)
router.route('/verify').post(Verify)
router.route('/signUp').post(signupAuth,signUp)
router.route('/signIn').post(signinAuth,signIn)


module.exports = router
