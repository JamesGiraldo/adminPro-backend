// Ruta /api/upload
const { Router } = require('express');
const expressfileUpload = require('express-fileupload');
// Importar el controlador y sus metodos
const { fileUpload, retornaImagen } = require('../controllers/uploads');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();

router.use(expressfileUpload());

router.put('/:tipo/:id', validarJWT, fileUpload);

router.get('/:tipo/:foto', validarJWT, retornaImagen);


module.exports = router;