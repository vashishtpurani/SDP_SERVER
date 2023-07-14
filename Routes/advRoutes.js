const {addAdv} = require("../Controllers/advCon/addAdv");
const {signUp,signIn} = require("../Controllers/advCon/advLoginController");
const {advLoginAuth} = require("../middleware/advLoginAuth");
const {reqQuery, ansQuery} = require("../Controllers/advCon/advQueryController");
const router = require('express').Router()

//FOR AUTH
router.route('/crtAdv').post(addAdv)
router.route('/verify').post(signUp)
router.route('/signIn').post(signIn)

//FOR QUERIES
router.route('/reqQuery').post(advLoginAuth,reqQuery)
router.route('/ansQuery/:id').post(advLoginAuth,ansQuery)

module.exports = router
