const {accessChat, fetchChats, reqCom, getCom, acceptCom, fetchChatsLaw} = require("../Controllers/chatCon/chatController");

const router = require('express').Router()

router.route('/reqCom/:advId').post(reqCom)
router.route('/getCom').get(getCom)
router.route('/acceptCom/:id').post(acceptCom)

router.route('/crtChat').post(accessChat)
router.route('/fetchChat').get(fetchChats)
router.route('/fetchChatLaw').get(fetchChatsLaw)

module.exports = router
