const mysql = require('mysql2')
const dotenv = require('dotenv').config()


const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user:  process.env.MYSQL_USER,
    password:  process.env.MYSQL_PASSWORD,
    database:  process.env.MYSQL_DATABASE,
  }).promise()

  const likePost = async (req, res) => {
    const {
        postId,
        userId,

    } = req.body
    try {

        if(!postId || !userId)
            throw Error('All fields must be filled')

        const [result] = await pool.query(`
        INSERT INTO Likes (PostID, UserID)
        VALUES (?, ?)
        `, [postId, userId])

        const id = result.insertId
        const [likes] = await pool.query(`
        SELECT * 
        FROM Likes
        WHERE LikeID = ?
        `, [id])

        if(![likes])
        {
            throw Error('User not fould in Database')
        }
        
    
    
    return res.status(201).json(likes);




    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const getLikes = async (req, res) => {
    const {
    } = req.body
    try {

        const [likes] = await pool.query("select * from likes")


        return res.status(201).json([likes]);



    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const getlike = async (req, res) => {
    const {
        likeId,
    } = req.body
    try {

        if(!likeId )
            throw Error('All fields must be filled')

            
        const [likes] = await pool.query(`
        SELECT * 
        FROM likes
        WHERE LikeID = ?
        `, [likeId])

    
     return res.status(201).json([likes][0]);



    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const getUserLikes = async (req, res) => {
    const {
        userId,
    } = req.body
    try {

        if(!userId)
            throw Error('All fields must be filled')

            
        const [likes] = await pool.query(`
        SELECT * 
        FROM likes
        WHERE UserID = ? 
        `, [userId])

    
     return res.status(201).json([likes]);



    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const getPostLikes = async (req, res) => {
    const {
        postId,
    } = req.body
    try {

        if(!postId)
            throw Error('All fields must be filled')

            
        const [likes] = await pool.query(`
        SELECT * 
        FROM likes
        WHERE PostID = ? 
        `, [postId])

    
     return res.status(201).json([likes]);



    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

module.exports = {

    
    likePost,
    getLikes,
    getlike,
    getUserLikes,
    getPostLikes,

  };