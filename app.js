const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const port = 8001;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Database connection
function dbConnection() {
    return new sqlite3.Database('students.sqlite', (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the students database.');
    });
}

// GET and POST for /students
app.route('/students')
    .get((req, res) => {
        const conn = dbConnection();
        const sql = "SELECT * FROM students";
        
        conn.all(sql, [], (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            
            const students = rows.map(row => ({
                id: row.id,
                firstname: row.firstname,
                lastname: row.lastname,
                gender: row.gender,
                age: row.age
            }));
            
            res.json(students);
            conn.close();
        });
    })
    .post((req, res) => {
        const { firstname, lastname, gender, age } = req.body;
        const conn = dbConnection();
        const sql = "INSERT INTO students (firstname, lastname, gender, age) VALUES (?, ?, ?, ?)";
        
        conn.run(sql, [firstname, lastname, gender, age], function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            
            res.send(`Student with id: ${this.lastID} created successfully`);
            conn.close();
        });
    });

// GET, PUT, DELETE for /student/:id
app.route('/student/:id')
    .get((req, res) => {
        const id = req.params.id;
        const conn = dbConnection();
        const sql = "SELECT * FROM students WHERE id = ?";
        
        conn.get(sql, [id], (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            
            if (row) {
                res.json(row);
            } else {
                res.status(404).send("Student not found");
            }
            conn.close();
        });
    })
    .put((req, res) => {
        const id = req.params.id;
        const { firstname, lastname, gender, age } = req.body;
        const conn = dbConnection();
        const sql = "UPDATE students SET firstname = ?, lastname = ?, gender = ?, age = ? WHERE id = ?";
        
        conn.run(sql, [firstname, lastname, gender, age, id], function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            
            if (this.changes === 0) {
                res.status(404).send("Student not found");
                return;
            }
            
            res.json({
                id: parseInt(id),
                firstname,
                lastname,
                gender,
                age
            });
            conn.close();
        });
    })
    .delete((req, res) => {
        const id = req.params.id;
        const conn = dbConnection();
        const sql = "DELETE FROM students WHERE id = ?";
        
        conn.run(sql, [id], function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            
            if (this.changes === 0) {
                res.status(404).send("Student not found");
                return;
            }
            
            res.send(`The Student with id: ${id} has been deleted.`);
            conn.close();
        });
    });

// Start server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
});