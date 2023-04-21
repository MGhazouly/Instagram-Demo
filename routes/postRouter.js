const express = require('express')
const { createPost, getPosts, getUserPosts, getPost } = require('../controller/postController')




const router = express.Router()


router.get('/posts', getPosts)

router.get('/post', getPost)

router.get('/userPosts', getUserPosts)


router.post('/post', createPost)






module.exports = router