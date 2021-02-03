require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbContection } = require('./database/config');


//  Crear el servidor de express
const app = express();

// Configurar CORS
app.use(cors());

// Lectura y parceo del Body 
app.use(express.json());

// Base De datos
dbContection();

// Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));


app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto', process.env.PORT);
});