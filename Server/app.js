const mysql = require('mysql')
const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;

// middlewares
app.use(cors({
    origin: ["https://to-do-app-nine-ochre.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))
app.use(bodyParser.json());
app.use(express.json());

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: "postgres://default:24KuaJMyTiOs@ep-noisy-wildflower-a4aaj6k8-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require",
});

pool.connect((err, client, release) => {
    if (err) {
        console.error('Error acquiring client', err.stack);
        return;
    }
    console.log('Connected!');
    release();
});

// var connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     database: 'todolist_db'
// });

// connection.connect((err) => {
//     if (err) throw err;
//     console.log('Connected!');
// });

app.get('/', (req,res) => {
    res.send('Hello World');
})

app.post('/auth/register', async (req, res) => {
    const { name, username, password } = req.body;
    console.log("Received registration request:", { name, username, password });

    const sql = "INSERT INTO \"user\" (name, username, password) VALUES ($1, $2, $3)";

    try {
        const client = await pool.connect();
        const result = await client.query(sql, [name, username, password]);
        client.release();

        console.log('User registered successfully:', result);
        res.status(200).json({ success: true, message: 'User registered successfully' });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ success: false, message: 'Database error' });
    }
});


app.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;
    // console.log("username is:", username);
    // console.log("password is:", password);

    const sql = "SELECT * FROM \"user\" WHERE username = $1 AND password = $2";

    try {
        const client = await pool.connect();
        const result = await client.query(sql, [username, password]);
        client.release();

        if (result.rows.length > 0) {
            res.status(200).json({ success: true });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ success: false, message: 'Database error' });
    }
});

app.post('/todos', async (req, res) => {
    const { username, todo, priority, EndDate } = req.body;
    const sql = "INSERT INTO todo_details (username, todo, priority, enddate) VALUES ($1, $2, $3, $4)";

    try {
        const client = await pool.connect();
        const result = await client.query(sql, [username, todo, priority, EndDate]);
        client.release();

        console.log('Todo registered successfully:', result);
        res.status(200).json({ success: true, message: 'Todo registered successfully' });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ success: false, message: 'Database error' });
    }
});

app.get('/todos', async (req, res) => {
    const { username, sortTodo } = req.query;

    if (!username) {
        return res.status(400).json({ success: false, message: 'Username parameter is required' });
    }

    let sql;
    let params = [username];

    if (sortTodo === 'priority') {
        sql = `
            SELECT todo_id, username, todo, priority, StartDate, EndDate
            FROM todo_details
            WHERE username = $1
            ORDER BY CASE priority
                WHEN 'high' THEN 1
                WHEN 'medium' THEN 2
                WHEN 'low' THEN 3
                ELSE 4
            END
        `;
    } else if (sortTodo === 'id') {
        sql = `
            SELECT todo_id, username, todo, priority, StartDate, EndDate
            FROM todo_details
            WHERE username = $1
            ORDER BY todo_id
        `;
    } else {
        return res.status(400).json({ success: false, message: 'Invalid sort option' });
    }

    try {
        const client = await pool.connect();
        const result = await client.query(sql, params);
        client.release();

        const todos = result.rows.map(row => ({
            username: row.username,
            startDate: row.startdate,
            endDate: row.enddate,
            id: row.todo_id,
            task: row.todo,
            priority: row.priority
        }));

        res.json({ success: true, todos });
    } catch (err) {
        console.error('Error fetching todos:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch todos' });
    }
});

app.delete('/todos', async (req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ success: false, message: 'Id parameter is required' });
    }

    const sql = 'DELETE FROM todo_details WHERE todo_id = $1';

    try {
        const client = await pool.connect();
        const result = await client.query(sql, [id]);
        client.release();

        if (result.rowCount > 0) {
            res.status(200).json({ success: true, message: `Todo with id ${id} deleted successfully` });
        } else {
            res.status(404).json({ success: false, message: `Todo with id ${id} not found` });
        }
    } catch (err) {
        console.error('Error deleting todo:', err);
        res.status(500).json({ success: false, message: 'Failed to delete todo' });
    }
});

app.put('/todos', async (req, res) => {
    const { id } = req.query;
    const { username, todo, priority, EndDate } = req.body;

    if (!id) {
        return res.status(400).json({ success: false, message: 'Id parameter is required' });
    }

    const sql = `
        UPDATE todo_details
        SET todo = $1, priority = $2, EndDate = $3
        WHERE todo_id = $4 AND username = $5
    `;

    try {
        const client = await pool.connect();
        const result = await client.query(sql, [todo, priority, EndDate, id, username]);
        client.release();

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Todo not found' });
        }

        res.json({ success: true, message: `Todo with id ${id} updated successfully` });
    } catch (err) {
        console.error('Error updating todo:', err);
        res.status(500).json({ success: false, message: 'Failed to update todo' });
    }
});

app.listen(port);
