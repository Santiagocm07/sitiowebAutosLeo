const express = require("express");

const app = express();
const path = require('path');

//Conexion de la DB
// let mysql = require("mysql");

// let conexion = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     port: 3306,
//     database: "autosleo"
// });

// conexion.connect(function(err){
//     if(err){
//         throw err;
//     }else{
//         console.log("conexion exitosa DB")
//     }
// });

app.use(express.json());
app.use(express.urlencoded({extended:false}));

// app.get('/tablaCitas', (req, res) => {
//     conexion.query('SELECT * FROM citas', (err, results) => {
//         if (err) throw err;
//         res.json(results);
//     });
// });

//Ruta de archivos
app.use(express.static("paginas"))
// app.use('/privada', express.static('privada'));


// Ruta de archivos estáticos desde la carpeta 'paginas'
// app.use(express.static(path.join(__dirname, 'paginas')));

// // Configuración de rutas
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'paginas', 'index.html'));
// });
// app.get('/nosotros', (req, res) => {
//     res.sendFile(path.join(__dirname, 'paginas', 'nosotros.html'));
// });
// app.get('/servicios', (req, res) => {
//     res.sendFile(path.join(__dirname, 'paginas', 'servicios.html'));
// });
// app.get('/preguntas', (req, res) => {
//     res.sendFile(path.join(__dirname, 'paginas', 'preguntas.html'));
// });

// app.get('/login', (req, res) => {
//     res.sendFile(path.join(__dirname, 'paginas', 'login.html'));
// });
// Ruta para la página privada
// app.get('/privada', (req, res) => {
//     res.sendFile(path.join(__dirname, 'paginas', 'privada', 'tablaCitas.html'));
// });


/*Consultas DB*/
//Selecionar los datos de la tabla
// const listaCitas = "SELECT * FROM citas";
// conexion.query(listaCitas, function(error,lista){
//     if(error){
//         throw error;
//     } else {
//         console.log(lista);
//     }
// });


//Insertar datos
// app.post("/validar", function(req,res){
//     const datos = req.body;

//     let usuario = datos.nom;
//     let cedula = datos.ced;
//     let contacto = datos.cel;
//     let placa = datos.placa;
//     let fecha = datos.fec;
//     let servicio = datos.servicio;
//     let vehiculo = datos.vehiculo;

//     let registrar = "INSERT INTO citas (nombre, cedula, numero_contacto, placa_vehiculo, fecha, tipo_servicio, tipo_vehiculo) VALUES('"+usuario+"', '"+cedula+"', '"+contacto+"', '"+placa+"', '"+fecha+"', '"+servicio+"', '"+vehiculo+"')";

//     conexion.query(registrar, function(error){
//         if (error){
//             throw error;
//         }else {
//             console.log("Datos almacenados con exito");
//         }
//     })

//     res.json({ success: true }); // Respuesta al cliente
// });

// conexion.end();



//Configurar el puerto para servicio local
app.listen(3000, function(){
    console.log("Servidor corriendo en el puerto http://localhost:3000");
});

