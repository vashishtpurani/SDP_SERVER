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
router.route('/reqQuery').get(reqQuery)
router.route('/ansQuery/:id').post(ansQuery)

module.exports = router
