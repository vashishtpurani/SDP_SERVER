const {sendMsg, getMsg} = require("../Controllers/msgController/msgController");
const router = require('express').Router()

router.route("/sendMsg").post(sendMsg)
router.route("/getMsg/:id").get(getMsg)

module.exports = router
