const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuarios');
const { generarJWT } = require('../helpers/jwt');

const login = async(req, res = response) => {

    // para obtener los valores del body
    const { email, password } = req.body;

    try {
        // verificar Email
        // consultar los campos que existan en la base de datos
        const ususarioDB = await Usuario.findOne({ email });
        // valdiar si el email no existe
        if (!ususarioDB) {
            // responder el estado y mensaje formato json
            return res.status(404).json({
                ok: false,
                msg: 'Contraseña o Email incorrecto.'
            });
        }
        // Verificar Contraseña encriptada.
        const validPassword = bcrypt.compareSync(password, ususarioDB.password);
        // valdiar si el password no existe
        if (!validPassword) {
            // responder el estado y mensaje formato json
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña o Email incorrecto.'
            });
        }

        // Generar El TOKEN JWT
        const token = await generarJWT(ususarioDB.id);

        res.json({
            ok: true,
            msg: `Bienvenido ${ ususarioDB.email }`,
            token: token
        });

        // Si lapetición esta mal mostrar el error.
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado...'
        });
    }
};

// esportar los metoso o modulos del controlador.
module.exports = {
    login: login
};