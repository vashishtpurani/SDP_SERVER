const {sendMsg, getMsgLaw} = require("../Controllers/msgController/msgController");
const router = require('express').Router()

router.route("/sendMsg/:id").post(sendMsg)
router.route("/getMsgLaw/:id").get(getMsgLaw)

module.exports = router
