const mysql = require('mysql2')
const dotenv = require('dotenv').config()


const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user:  process.env.MYSQL_USER,
    password:  process.env.MYSQL_PASSWORD,
    database:  process.env.MYSQL_DATABASE,
  }).promise()

  const createComment = async (req, res) => {
    const {
        postId,
        userId,
        commentText,

    } = req.body
    try {

        if(!postId || !userId || ! commentText)
            throw Error('All fields must be filled')

        const [result] = await pool.query(`
        INSERT INTO Comments (PostID, UserID, CommentText)
        VALUES (?, ?, ?)
        `, [postId, userId, commentText])

        const id = result.insertId
        const [comments] = await pool.query(`
        SELECT * 
        FROM Comments
        WHERE CommentID = ?
        `, [id])

        if(![comments])
        {
            throw Error('User not fould in Database')
        }
        
    
    
    return res.status(201).json(comments);




    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const getComments = async (req, res) => {
    const {
    } = req.body
    try {

        const [comments] = await pool.query("select * from comments")


        return res.status(201).json([comments]);



    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const getComment = async (req, res) => {
    const {
        commentId,
    } = req.body
    try {

        if(!commentId )
            throw Error('All fields must be filled')

            
        const [comments] = await pool.query(`
        SELECT * 
        FROM comments
        WHERE CommentID = ?
        `, [commentId])

    
     return res.status(201).json([comments][0]);



    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}
const getUserComments = async (req, res) => {
    const {
        userId,
    } = req.body
    try {

        if(!userId)
            throw Error('All fields must be filled')

            
        const [comments] = await pool.query(`
        SELECT * 
        FROM comments
        WHERE UserID = ? 
        `, [userId])

    
     return res.status(201).json([comments]);



    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const getUserPostsComments = async (req, res) => {
    const {
        userId,
        postId
    } = req.body
    try {

        if(!userId || !postId)
            throw Error('All fields must be filled')

            
        const [posts] = await pool.query(`
        SELECT * 
        FROM comments
        WHERE UserID = ? AND PostID = ?
        `, [userId , postId])

    
     return res.status(201).json([posts]);



    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

module.exports = {

    
    createComment,
    getComments,
    getComment,
    getUserComments,
    getUserPostsComments,

  };