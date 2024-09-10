import mysql from 'mysql';

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'autosleo'
});

connection.connect((err) => {
    if (err) {
        console.error('Error de conexion', err);
    } else {
        console.log('Conexion exitosa');
    }
});
