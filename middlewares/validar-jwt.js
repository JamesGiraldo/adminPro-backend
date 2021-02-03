const jwt = require('jsonwebtoken');

const validarJWT = (req, res, next) => {

    // Leer el Token
    const token = req.header('x-token');

    // validar si el token no es enviado en la petición o sea si no existe.
    if (!token) {
        // enviar mensaje de estado
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición.'
        });
    }

    // para evitar posibles errores
    try {
        // verificar el token generado
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        // mandar al req el id del token verificado
        req.uid = uid;

        // si todo sale correctamente.
        next();

        // Posible error 
    } catch (error) {
        // enviar mensaje de estado
        return res.status(401).json({
            ok: false,
            msg: ' Token no valido.'
        });
    }
};

// exportar la función 
module.exports = {
    validarJWT: validarJWT
};