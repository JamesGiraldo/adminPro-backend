const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuarios');
const { generarJWT } = require('../helpers/jwt');


// Get usuarios
const getUsuarios = async(req, res) => {

    // para evitar posibles errores
    try {
        // Consultar todos los usuarios
        const usuarios = await Usuario.find({}, 'nombre email role google');

        // responder con un ok 
        res.json({
            ok: true,
            usuarios: usuarios,
            uid: req.uid
        });

        // Si lapetición esta mal mostrar el error.
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado.'
        });
    }
};

// POST Usuario
const crearUsuario = async(req, res = response) => {

    // para obtener los valores del body
    const { email, password, nombre } = req.body;

    // para evitar posibles errores
    try {
        // consultar si existe el email 
        const existeEmail = await Usuario.findOne({ email });

        // validar si existe el email para responder mensaje
        if (existeEmail) {
            // responder el estado y mensaje formato json
            return res.status(400).json({
                ok: false,
                msg: 'Email duplicado.'
            });
        }

        // declarar una constante que almacena el nuevo usuario recibido por el body
        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);


        // guardar el usuario 
        await usuario.save();

        // Generar El TOKEN JWT        
        const token = await generarJWT(usuario.id);

        // Si realizo correctamente el registro
        res.json({
            ok: true,
            usuario: usuario,
            token: token
        });

        // Si lapetición esta mal mostrar el error.
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar algo.'
        });
    }
};

const actualizarUsuario = async(req, res = response) => {

    // TODO: Validar token y comprobar si es el usuario correcto.

    // Obtener el valor de los parametros URL
    const uid = req.params.id;

    // para evitar posibles errores
    try {
        // Consultar el usuario por id
        const usuarioDB = await Usuario.findById(uid);

        // valdiar si el ususario no existe
        if (!usuarioDB) {
            // responder el estado y mensaje formato json
            return res.status(404).json({
                ok: false,
                msg: 'No existe un ususario con esa identificación.'
            });
        }

        // Se selecciona todos los campos de body
        // Desectructura los campos recibidos por el body para extraer el password y el google, con los ...campos se obtine todos los demás campos del modelo
        const { password, google, email, ...campos } = req.body;

        // validar si es diferente el email 
        if (usuarioDB.email !== email) {
            // Verificación de que si existe el email
            const existeEmail = await Usuario.findOne({ email });
            // validar si existe el email para responder mensaje
            if (existeEmail) {
                // responder el estado y mensaje formato json
                return res.status(400).json({
                    ok: false,
                    msg: 'Email duplicado.'
                });
            }
        }
        // regresando el email que se esta actualizando
        campos.email = email;

        // actualiza el usuario y devuelve el nuevo valor
        const ususarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        // cuando la respuesta es ok
        res.json({
            ok: true,
            usuario: ususarioActualizado
        });
        // Si lapetición esta mal mostrar el error.
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado.'
        });
    }
};

const borrarUsuario = async(req, res = response) => {

    // Obtener el valor de los parametros  URL
    const uid = req.params.id;
    try {
        // Consultar el usuario por id
        const usuarioDB = await Usuario.findById(uid);
        // valdiar si el ususario no existe
        if (!usuarioDB) {
            // responder el estado y mensaje formato json
            return res.status(404).json({
                ok: false,
                msg: 'No existe un ususario con esa identificación.'
            });
        }

        await Usuario.findByIdAndDelete(uid);
        // Si realizo correctamente el registro
        res.json({
            ok: true,
            msg: 'Usuario eliminado.'
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
    getUsuarios: getUsuarios,
    crearUsuario: crearUsuario,
    actualizarUsuario: actualizarUsuario,
    borrarUsuario: borrarUsuario
};