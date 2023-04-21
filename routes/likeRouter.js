const express = require('express')
const { likePost, getLikes, getlike, getUserLikes, getPostLikes } = require('../controller/likeController')




const router = express.Router()




router.get('/likes', getLikes)

router.get('/like', getlike)

router.get('/userLikes', getUserLikes)

router.get('/postLikes', getPostLikes)


router.post('/like', likePost)




module.exports = router