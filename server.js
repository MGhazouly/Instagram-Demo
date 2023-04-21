const express = require('express')

const bodyParser = require('body-parser')
const dotenv = require('dotenv').config()
const cors = require('cors');


const app = express()
const userRouter = require("./routes/userRouter")
const postRouter = require("./routes/postRouter")
const commentRouter = require("./routes/commentRouter")
const likeRouter = require("./routes/likeRouter")



app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())
app.use(bodyParser.urlencoded({
    extended: false
})); // Parses urlencoded bodies
app.use(bodyParser.json());

app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: false,
}));



app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
    //print every request on the console
})
app.use('', userRouter)
app.use('', postRouter)
app.use('', commentRouter)
app.use('', likeRouter)

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(' The server is connected and listening on', port)
})