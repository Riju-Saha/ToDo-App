const router = require("express").Router();
const mysql = require('mysql')



router.post('/todos', async(req, res) => {
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

router.get('/todos', async(req, res) => {
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


router.delete('/todos', async(req, res) => {
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

router.put('/todos', async(req, res) => {
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