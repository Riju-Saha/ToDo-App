const mysql = require('mysql')
const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();


// middlewares
app.use(cors());
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

app.post('/auth/register', (req, res) => {
    const { name, username, password } = req.body;
    console.log("Received registration request:", { name, username, password });

    const sql = "INSERT INTO USER (name, username, password) VALUES (?, ?, ?)";
    connection.query(sql, [name, username, password], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ success: false, message: 'Database error' });
            return;
        }

        console.log('User registered successfully:', result);
        res.status(200).json({ success: true, message: 'User registered successfully' });
    });
});


app.post('/auth/login', (req, res) => {
    const { username, password } = req.body;
    // console.log("hello world")
    console.log("username is: ", username)
    console.log("password is: ", password)
    const sql = "SELECT * FROM user WHERE username = ? AND password = ?";
    connection.query(sql, [username, password], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ success: false, message: 'Database error' });
            return;
        }
        if (result.length > 0) {
            res.status(200).json({ success: true });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    });
});
http://localhost:3000/test?username=test
app.post('/todos', (req, res) => {
    const { username, todo, priority } = req.body;
    const sql = "INSERT INTO TODO_DETAILS (username, todo, priority) VALUES (?, ?, ?)"
    connection.query(sql, [username, todo, priority], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ success: false, message: 'Database error' });
            return;
        }

        console.log('todo registered successfully:', result);
        res.status(200).json({ success: true, message: 'todo registered successfully' });
    });
});

app.get('/todos', (req, res) => {
    const { username } = req.query;
    console.log({ username })
    if (!username) {
        return res.status(400).json({ success: false, message: 'Username parameter is required' });
    }

    const sql = 'SELECT * FROM TODO_DETAILS WHERE username = ?';
    connection.query(sql, [username], (err, results) => {
        if (err) {
            console.error('Error fetching todos:', err);
            return res.status(500).json({ success: false, message: 'Failed to fetch todos' });
        }
        // res.send(results)
        const todos = results.map(result => ({
            username: result.username,
            id: result.todo_id,
            task: result.todo,
            priority: result.priority
        }));
        res.json({ success: true, todos });
    });
});


app.delete('/todos', (req, res) => {
    const { id } = req.query;
    console.log({ id })
    if (!id) {
        return res.status(400).json({ success: false, message: 'Id parameter is required' });
    }
    const sql = 'DELETE FROM TODO_DETAILS WHERE todo_id = ?';
    connection.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Error fetching todos:', err);
            return res.status(500).json({ success: false, message: 'Failed to fetch todos' });
        }
        res.status(200).json({ success: true, message: `Todo with id ${id} deleted successfully` });
    });
});

app.put('/todos', (req, res) => {
    const { id } = req.query;
    const { username, todo, priority } = req.body;
    console.log({ id });

    if (!id) {
        return res.status(400).json({ success: false, message: 'Id parameter is required' });
    }

    const sql = 'UPDATE TODO_DETAILS SET todo=?, priority=? WHERE todo_id=? AND username=?';
    connection.query(sql, [todo, priority, id, username], (err, results) => {
        if (err) {
            console.error('Error updating todo:', err);
            return res.status(500).json({ success: false, message: 'Failed to update todo' });
        }

        // Check if any rows were affected
        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Todo not found' });
        }

        // Return a success message
        res.json({ success: true, message: `Todo with id ${id} updated successfully` });
    });
});


// app.get('/auth/login', (req,res) => [
//     res.status(200).json({success: true})
// ])

app.listen(8080);