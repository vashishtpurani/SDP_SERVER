const {accessChat, fetchChats, reqCom} = require("../Controllers/chatCon/chatController");

const router = require('express').Router()

router.route('/reqCom/:advId').post(reqCom)
router.route('/crtChat').post(accessChat)
router.route('/fetchChat').get(fetchChats)

module.exports = router
