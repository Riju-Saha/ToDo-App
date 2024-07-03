const router = require("express").Router();
const mysql = require('mysql')

router.post("/register", async (req, res) => {
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


router.post('/login', async (req, res) => {
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