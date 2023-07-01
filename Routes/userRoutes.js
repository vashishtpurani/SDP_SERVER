const router = require('express').Router()
const {signUp,Verify, sendOtp} = require("../Controllers/userController")
const {protect} = require("../middleware/auth")

router.route('/sendOtp').post(sendOtp)
router.route('/verify').post(Verify)
router.route('/signUp').post(protect,signUp)


module.exports = router
