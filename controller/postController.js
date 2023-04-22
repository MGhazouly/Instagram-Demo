
const mysql = require('mysql2')
const dotenv = require('dotenv').config()

const { isLiked, getUser } = require('../controller/userController')
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    port: process.env.MYSQL_PORT,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,

}).promise()

const createPost = async (req, res) => {
    const {
        userId,
        imageUrl,

    } = req.body
    try {

        if (!userId || !imageUrl)
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

        if (![posts]) {
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

    try {

        const [posts] = await pool.query("select * from Posts")

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

        if (!userId)
            throw Error('All fields must be filled')


        const [posts] = await pool.query(`
        SELECT * 
        FROM Posts
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

        if (!postId)
            throw Error('All fields must be filled')


        const [posts] = await pool.query(`
        SELECT * 
        FROM Posts
        WHERE PostID = ?
        `, [postId])


        return res.status(201).json([posts][0]);



    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const getPagePostData = async (req, res) => {

    /*
//given the user id from the body, return the following data:

 1)return all posts using getPosts function 
 2)for each post get the user first name and 
   last name using the post id  
 3)if a user id exist.loop in the likes table
  with the user id and the post id and search
  if the userid exist or not in them if yes
 return true or false.

Final Return 
{
1)user firstname,lastname
2)image url
3)number of comments
4)number of likes
5)liked:bolean 

}
*/

    try {

        const [posts] = await pool.query("select * from Posts")
        const result = await Promise.all(posts.map(async post => {
            const [author] = await pool.query(`
            SELECT * 
            FROM Users
            WHERE UserID = ?
            `, [post.UserID]) // retrieve author's name

            let liked = false // check if user liked post
            if (req.body.userId) {
                const [rows] = await pool.query(`
                SELECT * 
                FROM Likes
                WHERE PostID = ? AND UserID = ?
                `, [post.PostID, req.body.userId])

                if (rows.length > 0) {
                    liked = true;
                }

            }





            return {
                postID: post.PostID,
                authorID: author[0].UserID,
                firstname: author[0].Firstname,
                lastname: author[0].Lastname,
                imageUrl: post.PostImage,
                postDate: post.PostDate,
                CommentCounter: post.CommentCounter,
                LikesCounter: post.LikesCounter,
                liked: liked
            };
        }));

        return res.status(201).json(result);
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }


}
module.exports = {

    getPagePostData,
    createPost,
    getPosts,
    getUserPosts,
    getPost,
};