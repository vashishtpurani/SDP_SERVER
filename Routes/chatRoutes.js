const {accessChat} = require("../Controllers/chatCon/chatController");

const router = require('express').Router()

router.route('/crtChat').post(accessChat)

module.exports = router
