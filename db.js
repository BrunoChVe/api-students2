const sqlite3 = require('sqlite3').verbose();

// Crear conexión a la base de datos
const conn = new sqlite3.Database('students.sqlite', (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
        return;
    }
    console.log('Conectado a la base de datos SQLite.');
});

// Crear la tabla students
const sqlQuery = `CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    gender TEXT NOT NULL,
    age TEXT
)`;

conn.run(sqlQuery, (err) => {
    if (err) {
        console.error('Error al crear la tabla:', err.message);
    } else {
        console.log('Tabla "students" creada exitosamente.');
    }
    
    // Cerrar la conexión
    conn.close((err) => {
        if (err) {
            console.error('Error al cerrar la conexión:', err.message);
        } else {
            console.log('Conexión a la base de datos cerrada.');
        }
    });
});