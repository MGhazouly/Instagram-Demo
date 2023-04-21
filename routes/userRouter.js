const express = require('express')
const { getAllUsers, createUser, getUser } = require('../controller/userController')



const router = express.Router()



router.get('/users', getAllUsers)


router.get('/user', getUser)


router.post('/user', createUser)






module.exports = router