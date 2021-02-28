const { response } = require('express');
const bcrypt = require('bcryptjs');

const Medico = require('../models/medico');


// Get Medicos
const getMedicos = async(req, res = response) => {

    // para evitar posibles errores
    try {
        // Consultar todos los Medicos
        const medicos = await Medico.find()
            .populate('usuario', 'nombre img')
            .populate('hospital', 'nombre img');

        // responder con un ok 
        res.json({
            ok: true,
            medicos: medicos
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

// POST Medico
const crearMedico = async(req, res = response) => {

    // Obtener el id de los parametros  URL del token
    const uid = req.uid;
    // declarar una constante que almacena el nuevo Medico recibido por el body
    // Desestructurar los campos
    const medico = new Medico({
        usuario: uid,
        ...req.body //todos los campos que vienen en el body
    });

    // para evitar posibles errores
    try {
        // guardar el Medico
        const medicoDB = await medico.save();

        // Si realizo correctamente el registro
        res.json({
            ok: true,
            medico: medicoDB
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

// PUT Hospital
const actualizarMedico = async(req, res = response) => {

    // TODO: Validar token y comprobar si es el usuario correcto.

    // Obtener el valor de los parametros URL
    // const uid = req.params.id;

    // para evitar posibles errores
    try {
        // Consultar el medico por id
        // const medicoDB = await Medico.findById(uid);

        // valdiar si el Medico no existe
        // if (!medicoDB) {
        // responder el estado y mensaje formato json
        // return res.status(404).json({
        // ok: false,
        // msg: 'No existe un Medico con esa identificación.'
        // });
        // }

        // Se selecciona todos los campos de body
        // Desectructura los campos recibidos por el body para extraer los ...campos se obtine todos los demás campos del modelo
        // const { nombre, ...campos } = req.body;

        // validar si es diferente el nombre 
        // if (medicoDB.nombre !== nombre) {
        //     // Verificación de que si existe el nombre
        //     const existeNombre = await Medico.findOne({ nombre });
        //     // validar si existe el email para responder mensaje
        //     if (existeNombre) {
        //         // responder el estado y mensaje formato json
        //         return res.status(400).json({
        //             ok: false,
        //             msg: 'Nombre duplicado.'
        //         });
        //     }
        // }
        // regresando el email que se esta actualizando
        // campos.nombre = nombre;

        // actualiza el hospital y devuelve el nuevo valor
        // const medicoActualizado = await Medico.findByIdAndUpdate(uid, campos, { new: true });

        // cuando la respuesta es ok
        res.json({
            ok: true,
            msg: 'Petición PUT Medicos'
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

// DELETE Hospital
const borrarMedico = async(req, res = response) => {

    // Obtener el valor de los parametros  URL
    // const uid = req.params.id;
    try {
        // Consultar el medico por id
        // const medicoDB = await Medico.findById(uid);
        // // valdiar si el Medico no existe
        // if (!medicoDB) {
        //     // responder el estado y mensaje formato json
        //     return res.status(404).json({
        //         ok: false,
        //         msg: 'No existe un Medico con esa identificación.'
        //     });
        // }

        // await Medico.findByIdAndDelete(uid);
        // Si realizo correctamente el registro
        res.json({
            ok: true,
            menssage: 'Petición DELETE Medico',
            msg: 'Hospital eliminado.'
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
    getMedicos: getMedicos,
    crearMedico: crearMedico,
    actualizarMedico: actualizarMedico,
    borrarMedico: borrarMedico
};