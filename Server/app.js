const mysql = require('mysql')
const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const path = require("path")
const auth = require("./routes/auth");
const list = require("./routes/list");


// middlewares
// app.use(cors({
//     origin: ['.vercel.app'],
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true
// }));
app.use(cors())
app.use(bodyParser.json());
app.use(express.json());


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'todolist_db'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
});

app.get('/', (req,res) => {
    res.send('Hello World');
})


app.use("/api/v1", auth);
app.use("/api/v2", list);


// app.get('/auth/login', (req,res) => [
//     res.status(200).json({success: true})
// ])

app.get('/', (req,res) =>{
    app.use(express.static(path.resolve(__dirname, "todo", "build")));
    res.sendFile(path.resolve(__dirname, "todo", "build", "index.html"));
});

app.listen(8080);