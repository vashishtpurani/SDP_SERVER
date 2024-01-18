const {createPost, replyToPost, getAllPosts,getPost} = require("../Controllers/communityCon/communityCon");

const router = require('express').Router()

router.route('/post').post(createPost)
router.route('/reply').post(replyToPost)
router.route("/getAll").get(getAllPosts)
router.route("/getOne/:id").get(getPost)

module.exports = router
