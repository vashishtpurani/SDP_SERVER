const {sendMsg, getMsgLaw, getMsgUser} = require("../Controllers/msgController/msgController");
const router = require('express').Router()

router.route("/sendMsg/:id").post(sendMsg)
router.route("/getMsgLaw/:id").get(getMsgLaw)
router.route("/getMsgUser/:id").get(getMsgUser)

module.exports = router
