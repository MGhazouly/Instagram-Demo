const mysql = require('mysql2')
const dotenv = require('dotenv').config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user:  process.env.MYSQL_USER,
    password:  process.env.MYSQL_PASSWORD,
    database:  process.env.MYSQL_DATABASE,
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

        if(!firstname || !lastname  || !email || !username || ! password)
            throw Error('All fields must be filled')

        const [result] = await pool.query(`
        INSERT INTO users (UserName, Password, Firstname, Lastname,email)
        VALUES (?, ?, ?, ?, ?)
        `, [username, password,firstname,lastname,email])

        const id = result.insertId
        const [users] = await pool.query(`
        SELECT * 
        FROM users
        WHERE UserID = ?
        `, [id])

        if(![users])
        {
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

const getUser = async (req, res) => {
    const {
        id,
    } = req.body
    try {

        if(!id )
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

module.exports = {

    
    createUser,
   
    getAllUsers,

    getUser,


  };