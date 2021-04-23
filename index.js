require('dotenv').config();

const express = require('express');
const cors = require('cors');
const colors = require('colors');

/** conección(configuración) de la base de datos */
const { dbContection } = require('./database/config');

/**   Crear el servidor de express */
const app = express();

/**  Configurar CORS */
app.use(cors());

/**  Lectura y parceo del Body  */
app.use(express.json());

/**  Base De datos */
dbContection();

/** Directorio publico */
app.use(express.static('public'));

/**  Rutas */
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/upload', require('./routes/uploads'));
app.use('/api/login', require('./routes/auth'));

/** ejecutar servidor en el puerto que esta las variables de entorno */
app.listen(process.env.PORT, () => {
    /** imprimir respuesta de ejecución del servidor */
    console.log(`Servidor corriendo en el puerto`.magenta, `${process.env.PORT}`.cyan);
});