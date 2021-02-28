// Ruta /api/todo/:busqueda
const { Router } = require('express');
const { check } = require('express-validator');
// Importar el controlador y sus metodos
const { getBusqueda, getDocumentoColeccion } = require('../controllers/busquedas');

const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();


router.get('/:busqueda', [
        validarJWT
    ],
    getBusqueda
);
router.get('/coleccion/:tabla/:busqueda', [
        validarJWT
    ],
    getDocumentoColeccion
);


module.exports = router;