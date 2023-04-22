const express = require('express')

const bodyParser = require('body-parser')
const dotenv = require('dotenv').config()
const cors = require('cors');
const userRouter = require("./routes/userRouter")
const postRouter = require("./routes/postRouter")
const commentRouter = require("./routes/commentRouter")
const likeRouter = require("./routes/likeRouter")
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mysql = require('mysql2')
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

// const pool = mysql.createPool({
//     host: process.env.MYSQL_HOST,
//     user: process.env.MYSQL_USER,
//     port: process.env.MYSQL_PORT,
//     password: process.env.MYSQL_PASSWORD,
//     database: process.env.MYSQL_DATABASE,
// }).promise()


require('./config/passport');
require('dotenv').config();
const app = express()


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
    next();
});
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: new MySQLStore({
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 14 * 24 * 3600000,

    }
}));
app.use(passport.initialize());
app.use(passport.session());

/*Mysql Connection*/








/*middleware*/






app.use('', userRouter)
app.use('', postRouter)
app.use('', commentRouter)
app.use('', likeRouter)


const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(' The server is connected and listening on', port)
})