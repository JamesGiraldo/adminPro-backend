const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuarios');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async(req, res = response) => {

    /** para obtener los valores del body */
    const { email, password } = req.body;

    try {
        /** verificar Email */
        /**  consultar los campos que existan en la base de datos */
        const usuarioDB = await Usuario.findOne({ email });

        /** valdiar si el email no existe */
        if (!usuarioDB) {
            /** responder el estado y mensaje formato json */
            return res.status(404).json({
                ok: false,
                msg: 'Contraseña o Email incorrecto.'
            });
        }

        /** Verificar Contraseña encriptada. */
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        
        /** valdiar si el password no existe */
        if (!validPassword) {
            /** responder el estado y mensaje formato json */
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña o Email incorrecto.'
            });
        }

        /** Generar El TOKEN JWT */
        const token = await generarJWT(usuarioDB.id);

        /** respuesta ok */
        res.json({
            ok: true,
            msg: `Bienvenido ${ usuarioDB.email }`,
            token: token
        });

        /**  Si lapetición esta mal mostrar el error. */
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado...'
        });
    }
};

const googleSignIn = async(req, res = response) => {

    /** tomar el token de body  */
    const googleToken = req.body.token;

    try {
        const { name, email, picture } = await googleVerify(googleToken);

        /** Validar si el usuario existe */
        const usuarioDB = await Usuario.findOne({ email });

        /** variable vacia */
        let usuario;

        if ( !usuarioDB ){
            /** Si el usuario no existe va crear uno nuevo */
            usuario = new Usuario({
                nombre: name,
                email,
                password: `@@@`,
                img: picture,
                google: true 
            });
        } else {
            /** Si existe el usuario */
            usuario = usuarioDB;
            usuario.google = true;
        }

        /** Guardar en la base de datos */
        await usuario.save();

        /** Generar El TOKEN JWT */
        const token = await generarJWT( usuario.id );

        /** respuesta ok */
        res.json({
            ok: true,
            token: token
        });

        /**  Si lapetición esta mal mostrar el error. */
    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'Token no es correcto.'
        });
    }
};

const renewToken = async(req, res = response) => {

    /** tomar el uid del usuario */
    const uid = req.uid;

    /** Generar El TOKEN JWT */
    const token = await generarJWT( uid );

    res.json({
        ok: true,
        token: token
    });
};

/**  esportar los metoso o modulos del controlador. */
module.exports = {
    login: login,
    googleSignIn: googleSignIn,
    renewToken: renewToken
};