const router = require('express').Router()
const {signUp,Verify, sendOtp, signIn} = require("../Controllers/userCon/userLoginController")
const {signupAuth} = require("../middleware/signupAuth")
const {signinAuth} = require("../middleware/signinAuth");
const {raiseQuery, fetchAll, fetchUserAll, reopenQuery} = require("../Controllers/userCon/userQueryController")

//for user Auth
router.route('/sendOtp/:num').post(sendOtp)
router.route('/verify').post(Verify)
router.route('/signUp').post(signupAuth,signUp)
router.route('/signIn').post(signIn)

//for queries
router.route('/raiseQuery').post(signinAuth,raiseQuery)
router.route('/getAll').get(fetchAll)
router.route('/getMy').get(signinAuth,fetchUserAll)
router.route('/reopen/:id').post(signinAuth,reopenQuery)

module.exports = router
