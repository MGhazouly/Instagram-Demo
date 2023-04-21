const express = require('express')
const { createComment, getComments, getComment, getUserPostsComments, getUserComments } = require('../controller/commentController')




const router = express.Router()



router.post('/comments', getComments)

router.get('/comment', getComment)

router.get('/userPostsComments', getUserPostsComments)

router.get('/userComments', getUserComments)

router.post('/comment', createComment)





module.exports = router