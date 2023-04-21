
const mysql = require('mysql2')
const dotenv = require('dotenv').config()


const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user:  process.env.MYSQL_USER,
    password:  process.env.MYSQL_PASSWORD,
    database:  process.env.MYSQL_DATABASE,
  }).promise()

  const createPost = async (req, res) => {
    const {
        userId,
        imageUrl,

    } = req.body
    try {

        if(!userId || !imageUrl )
            throw Error('All fields must be filled')

        const [result] = await pool.query(`
        INSERT INTO Posts (UserID, PostImage)
        VALUES (?, ?)
        `, [userId, imageUrl])

        const id = result.insertId
        const [posts] = await pool.query(`
        SELECT * 
        FROM Posts
        WHERE PostID = ?
        `, [id])

        if(![posts])
        {
            throw Error('User not fould in Database')
        }
        
    
    
    return res.status(201).json(posts);




    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const getPosts = async (req, res) => {
    const {
    } = req.body
    try {

        const [posts] = await pool.query("select * from posts")


        return res.status(201).json([posts]);



    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const getUserPosts = async (req, res) => {
    const {
        userId,
    } = req.body
    try {

        if(!userId )
            throw Error('All fields must be filled')

            
        const [posts] = await pool.query(`
        SELECT * 
        FROM posts
        WHERE UserID = ?
        `, [userId])

    
     return res.status(201).json([posts]);



    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const getPost = async (req, res) => {
    const {
        postId,
    } = req.body
    try {

        if(!postId )
            throw Error('All fields must be filled')

            
        const [posts] = await pool.query(`
        SELECT * 
        FROM posts
        WHERE PostID = ?
        `, [postId])

    
     return res.status(201).json([posts][0]);



    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

module.exports = {

    
    createPost,
    getPosts,
    getUserPosts,
    getPost,
  };