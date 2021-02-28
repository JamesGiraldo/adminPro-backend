const { response } = require('express');
const { validationResult } = require('express-validator');

/** valida todos los campos correspondientes a tal modelo */
const validarCampos = (req, res = response, next) => {

    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errores.mapped()
        });
    }
    /** continua o le da siguiente a la operación */
    next();
};

/** esporta los metodos realizados en el archivo */
module.exports = {
    validarCampos: validarCampos
};