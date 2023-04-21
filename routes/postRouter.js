const express = require('express')
const { createPost, getPosts, getUserPosts, getPost, getPagePostData } = require('../controller/postController')




const router = express.Router()


router.get('/posts', getPosts)

router.get('/post', getPost)

router.get('/userPosts', getUserPosts)


router.post('/post', createPost)


router.get("/PostCompData", getPagePostData)




module.exports = router