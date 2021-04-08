// Ruta /api/medicos
const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { getMedicos, crearMedico, actualizarMedico, borrarMedico } = require('../controllers/medicos');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();

router.get('/', [
    validarJWT
], getMedicos);

router.post('/', [
        validarJWT,
        check('nombre', 'El nombre es necesario').not().isEmpty(),
        check('hospital', 'El id del hospital es necesario').isMongoId(),
        validarCampos
    ],
    crearMedico
);

router.put('/:id', [
        validarJWT
    ],
    actualizarMedico
);

router.delete('/:id', [
        validarJWT
    ],
    borrarMedico
);

module.exports = router;