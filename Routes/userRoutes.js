const router = require('express').Router()
const {signUp,Verify, sendOtp, signIn} = require("../Controllers/userCon/userLoginController")
const {signupAuth} = require("../middleware/signupAuth")
const {signinAuth} = require("../middleware/signinAuth");
const {raiseQuery, fetchAll, fetchUserAll, reopenQuery, sentenceSimilarity, filterQuery, getOne, upVote, downVote} = require("../Controllers/userCon/userQueryController")
const {crtFeedback} = require("../Controllers/feedbackCon/feedbackController");

//for user Auth
router.route('/sendOtp/:num').post(sendOtp)
router.route('/verify').post(Verify)
router.route('/signUp').post(signupAuth,signUp)
router.route('/signIn').post(signIn)

//for queries
router.route('/raiseQuery').post(signinAuth,raiseQuery)
router.route('/senSim').post(sentenceSimilarity)
router.route('/getAll').get(fetchAll)
router.route('/filterQuery/:filter').get(filterQuery)
router.route('/getMy').get(signinAuth,fetchUserAll)
router.route('/getOne/:id').get(getOne)
router.route('/reopen/:id').post(signinAuth,reopenQuery)
router.route("/upVote/:queryId").put(upVote)
router.route("/downVote/:queryId").put(downVote)

//for feedback
router.route('/crtFeedback').post(crtFeedback)

module.exports = router
