const mysql = require('mysql2')
const dotenv = require('dotenv').config()


const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
}).promise()

const createComment = async (req, res) => {
    const {
        postId,
        userId,
        commentText,

    } = req.body
    try {

        if (!postId || !userId || !commentText)
            throw Error('All fields must be filled')

        const [result] = await pool.query(`
        INSERT INTO Comments (PostID, UserID, CommentText)
        VALUES (?, ?, ?)
        `, [postId, userId, commentText])

        //Increment the post comments counter
        const [post] = await pool.query(`
        SELECT *
        FROM Posts
        WHERE PostID = ?
        `, [postId])
        const comments = post[0].CommentCounter + 1

        const [result2] = await pool.query(`
        UPDATE Posts
        SET CommentCounter = ?
        WHERE PostID = ?
        `, [comments, postId])


        return res.status(201).json({ message: 'Comment created' });




    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const getComments = async (req, res) => {
    const {
        postId,
    } = req.body
    try {

        if (!postId) {
            throw Error('All fields must be filled')
        }
        const [comments] = await pool.query("select * from Comments where PostID = ?", [postId])
        const result = await Promise.all(comments.map(async comment => {
            const [userCommented] = await pool.query("select * from Users where UserID = ?", [comment.UserID])


            return {
                "FirstNameCommented": userCommented[0].Firstname,
                "LastNameCommented": userCommented[0].Lastname,
                "CommentText": comment.CommentText,
                "CommentDate": comment.CommentDate
            };
        }));




        return res.status(201).json(result);



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

        if (!commentId)
            throw Error('All fields must be filled')


        const [comments] = await pool.query(`
        SELECT * 
        FROM Comments
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

        if (!userId)
            throw Error('All fields must be filled')


        const [comments] = await pool.query(`
        SELECT * 
        FROM Comments
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

        if (!userId || !postId)
            throw Error('All fields must be filled')


        const [posts] = await pool.query(`
        SELECT * 
        FROM Comments
        WHERE UserID = ? AND PostID = ?
        `, [userId, postId])


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