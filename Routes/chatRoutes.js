const {accessChat, fetchChats} = require("../Controllers/chatCon/chatController");

const router = require('express').Router()

router.route('/crtChat').post(accessChat)
router.route('/fetchChat').get(fetchChats)

module.exports = router
