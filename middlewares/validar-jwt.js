const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarios')

const validarJWT = (req, res, next) => {

    /**  Leer el Token */
    const token = req.header('x-token');

    /**  validar si el token no es enviado en la petición o sea si no existe. */
    if (!token) {
        /** enviar mensaje de estado */
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición.'
        });
    }

    /**  para evitar posibles errores */
    try {
        /**  verificar el token generado */
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);

        /**  mandar al req el id del token verificado */
        req.uid = uid;

        /**  si todo sale correctamente. */
        next();

        /**  Posible error */
    } catch (error) {
        /**  enviar mensaje de estado */
        return res.status(401).json({
            ok: false,
            msg: ' Token no valido.'
        });
    }
};

const validarADMIN_ROLE = async(req, res, next) => {

    /** tomar el id del usuario que viene en la requests */
    const uid = req.uid;

    /**  para evitar posibles errores */
    try {
        /** buscar el usuario por medio del id */
        const usuarioDB =  await Usuario.findById( uid );

        /** si el usuario no viene  */
        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: ' Usuario no existe.'
            });
        } 
        /** el viene el usuario pero no es administrador */
        if ( usuarioDB.role !== 'ADMIN_ROLE' ) {
            return res.status(403).json({
                ok: false,
                msg: ' No tiene los privilegios para hacer eso.'
            });
        }

        /** si todo esta ok  */
        next(); 

        /**  Posible error */
    } catch (error) {
        /**  enviar mensaje de estado */
        return res.status(401).json({
            ok: false,
            msg: ' Token no valido.'
        });
    }
}


const validarADMIN_ROLE_o_mismoUsuario = async(req, res, next) => {

    /** tomar el id del usuario que viene en la requests */
    const uid = req.uid;
    /** obtener el id que se va modificar */
    const id = req.params.id; 

    /**  para evitar posibles errores */
    try {
        /** buscar el usuario por medio del id */
        const usuarioDB =  await Usuario.findById( uid );

        /** si el usuario no viene  */
        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: ' Usuario no existe.'
            });
        } 
        /** Si el usuario tiene como rol ADMIn y si el id del usuario es igual a id del parametro que se requiere para actualizar asi mismo su usuario */
        if ( usuarioDB.role === 'ADMIN_ROLE' || uid === id ) {            
            /** si todo esta ok  */
            next(); 
        } else {                        
            /**  si no e sun usuario administrador y si no es el mismo id del usuario presente  */
            return res.status(403).json({
                ok: false,
                msg: ' No tiene los privilegios para hacer eso.'
            });
        }


        /**  Posible error */
    } catch (error) {
        /**  enviar mensaje de estado */
        return res.status(401).json({
            ok: false,
            msg: ' Token no valido.'
        });
    }
}


/**  exportar la función */
module.exports = {
    validarJWT: validarJWT,
    validarADMIN_ROLE: validarADMIN_ROLE,
    validarADMIN_ROLE_o_mismoUsuario: validarADMIN_ROLE_o_mismoUsuario
};