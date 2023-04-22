const mysql = require('mysql2')
const dotenv = require('dotenv').config()
const { validPassword, genPassword } = require('../util/PasswordValidation');

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    port: process.env.MYSQL_PORT,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
}).promise()

const createUser = async (req, res) => {
    const {
        firstname,
        lastname,
        email,
        username,
        password,

    } = req.body
    try {

        if (!firstname || !lastname || !email || !username || !password)
            throw Error('All fields must be filled')

        const [result] = await pool.query(`
        INSERT INTO users (UserName, Password, Firstname, Lastname,email)
        VALUES (?, ?, ?, ?, ?)
        `, [username, password, firstname, lastname, email])

        const id = result.insertId
        const [users] = await pool.query(`
        SELECT * 
        FROM users
        WHERE UserID = ?
        `, [id])

        if (![users]) {
            throw Error('User not fould in Database')
        }



        return res.status(201).json(users[0]);




    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}




const getAllUsers = async (req, res) => {
    const {
    } = req.body
    try {

        const [rows] = await pool.query("select * from users")
        console.log(rows)

        return res.status(201).json([rows]);




    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}


const isLiked = async (req, res) => {
    const {
        postId,
        userId,
    } = req.body
    try {

        if (!postId)
            throw Error('All fields must be filled')

        if (!userId)
            return res.status(201).json(false);

        const [rows] = await pool.query(`
        SELECT * 
        FROM Likes
        WHERE PostID = ? AND UserID = ?
        `, [postId, userId])

        if (![rows]) {
            return res.status(201).json(false);
        }
        else {
            return res.status(201).json(true);
        }

    } catch (error) {
        res.status(400).json({
            error: error.message
        })

    }
}

const getUser = async (req, res) => {
    const {
        id,
    } = req.body.userId
    try {

        if (!id)
            throw Error('All fields must be filled')


        const [users] = await pool.query(`
        SELECT * 
        FROM users
        WHERE UserID = ?
        `, [id])


        return res.status(201).json(users[0]);



    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}


function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}



async function userExists(req, res, next) {
    if (!req.body.username) {
        res.status(400).send("Please enter all fields");
    }
    try {
        let [user] = await pool.query('SELECT * FROM users where UserName = ? ', [req.body.username]);
        if (user.length > 0) {
            res.status(400).send("User already exists");
        }
        else {
            next();
        }
    } catch (err) { res.status(500).send(err) }

}



/*routes*/













const Register = async (req, res, next) => {
    let { username, password, Firstname, Lastname } = req.body;
    if (!username || !password || !Firstname || !Lastname) {
        res.status(400).send("Please enter all fields");
    }

    const saltHash = genPassword(req.body.password);
    const salt = saltHash.salt;
    const hash = saltHash.hash;
    try {
        await pool.query('Insert into users(UserName,hash,salt,Firstname,Lastname) values(?,?,?,?,?) ', [req.body.username, hash, salt, Firstname, Lastname]);
        res.status(200).send("User created");
    } catch (err) { res.status(500).send(err) }


};







module.exports = {


    createUser,

    getAllUsers,

    getUser,

    isLiked,
    isAuth,
    Register,
    userExists



};