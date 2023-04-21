const mysql = require('mysql2')
const dotenv = require('dotenv').config()


const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
}).promise()

const likePost = async (req, res) => {
    const {
        postId,
        userId,

    } = req.body
    try {

        if (!postId || !userId)
            throw Error('All fields must be filled')

        //Check if the user already liked the post
        const [isLiked] = await pool.query(`
        SELECT *
        FROM Likes
        WHERE PostID = ? AND UserID = ?
        `, [postId, userId])
        if (isLiked.length == 0) {
            const [result] = await pool.query(`
            INSERT INTO Likes (PostID, UserID)
            VALUES (?, ?)
            `, [postId, userId])
            //incerement the postlikescounter 
            const [post] = await pool.query(`
            SELECT *
            FROM Posts
            WHERE PostID = ?
            `, [postId])
            const likes = post[0].LikesCounter + 1

            const [result2] = await pool.query(`
            UPDATE Posts
            SET LikesCounter = ?
            WHERE PostID = ?
            `, [likes, postId])
            return res.status(201).json({ message: 'Post liked' });

        }
        else {
            return res.status(201).json({ message: 'Already liked it before' });

        }







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

        if (!likeId)
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

        if (!userId)
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

        if (!postId)
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