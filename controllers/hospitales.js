const { response } = require('express');
const bcrypt = require('bcryptjs');

const Hospital = require('../models/hospital');


// Get Hospitales
const getHospitales = async(req, res = response) => {

    // para evitar posibles errores
    try {
        // Consultar todos los hospitales
        const hospitales = await Hospital.find()
            .populate('usuario', 'nombre img');

        // responder con un ok 
        res.json({
            ok: true,
            hospitales: hospitales
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

// POST Hospital
const crearHospital = async(req, res = response) => {

    // Obtener el id de los parametros  URL del token
    const uid = req.uid;
    // declarar una constante que almacena el nuevo hospital recibido por el body
    // Desestructurar los campos
    const hospital = new Hospital({
        usuario: uid,
        ...req.body //todos los campos que vienen en el body
    });

    // para evitar posibles errores
    try {
        // guardar el hospital 
        const hospitalDB = await hospital.save();

        // Si realizo correctamente el registro
        res.json({
            ok: true,
            hospital: hospitalDB
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
const actualizarHospital = async(req, res = response) => {

    // TODO: Validar token y comprobar si es el usuario correcto.

    // Obtener el valor de los parametros URL
    const uid = req.params.id;

    // para evitar posibles errores
    try {
        // Consultar el usuario por id
        const hospitalDB = await Hospital.findById(uid);

        // valdiar si el hospital no existe
        if (!hospitalDB) {
            // responder el estado y mensaje formato json
            return res.status(404).json({
                ok: false,
                msg: 'No existe un hospital con esa identificación.'
            });
        }

        // Se selecciona todos los campos de body
        // Desectructura los campos recibidos por el body para extraer los ...campos se obtine todos los demás campos del modelo
        const { nombre, ...campos } = req.body;

        // validar si es diferente el nombre 
        if (hospitalDB.nombre !== nombre) {
            // Verificación de que si existe el nombre
            const existeNombre = await Hospital.findOne({ nombre });
            // validar si existe el email para responder mensaje
            if (existeNombre) {
                // responder el estado y mensaje formato json
                return res.status(400).json({
                    ok: false,
                    msg: 'Nombre duplicado.'
                });
            }
        }
        // regresando el email que se esta actualizando
        campos.nombre = nombre;

        // actualiza el hospital y devuelve el nuevo valor
        const hospitalActualizado = await Hospital.findByIdAndUpdate(uid, campos, { new: true });

        // cuando la respuesta es ok
        res.json({
            ok: true,
            hospital: hospitalActualizado
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
const borrarHospital = async(req, res = response) => {

    // Obtener el valor de los parametros  URL
    const uid = req.params.id;
    try {
        // Consultar el hospital por id
        const hospitalDB = await Hospital.findById(uid);
        // valdiar si el hospital no existe
        if (!hospitalDB) {
            // responder el estado y mensaje formato json
            return res.status(404).json({
                ok: false,
                msg: 'No existe un hospital con esa identificación.'
            });
        }

        await Hospital.findByIdAndDelete(uid);
        // Si realizo correctamente el registro
        res.json({
            ok: true,
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
    getHospitales: getHospitales,
    crearHospital: crearHospital,
    actualizarHospital: actualizarHospital,
    borrarHospital: borrarHospital
};