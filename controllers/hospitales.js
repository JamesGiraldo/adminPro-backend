const { response } = require('express');
const Hospital = require('../models/hospital');

/** Get Hospitales */
const getHospitales = async(req, res = response) => {

    /** para evitar posibles errores */
    try {
        /** Consultar todos los hospitales */
        const hospitales = await Hospital.find()
            .populate('usuario', 'nombre img');

        /** responder con un ok */
        res.json({
            ok: true,
            hospitales: hospitales
        });

        /*/ Si lapetición esta mal mostrar el error. */
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, Hable con el administrador'
        });
    }
};

/** POST Hospital */
const crearHospital = async(req, res = response) => {

    /** Obtener el id de los parametros  URL del token */
    const uid = req.uid;
    /** declarar una constante que almacena el nuevo hospital recibido por el body */
    /** Desestructurar los campos */
    const hospital = new Hospital({
        usuario: uid,
        ...req.body /** todos los campos que vienen en el body */
    });

    /** para evitar posibles errores */
    try {
        /** guardar el hospital */
        const hospitalDB = await hospital.save();

        /** Si realizo correctamente el registro */
        res.json({
            ok: true,
            hospital: hospitalDB
        });

        /** Si lapetición esta mal mostrar el error. */
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, Hable con el administrador'
        });
    }
};

/** PUT Hospital */
const actualizarHospital = async(req, res = response) => {

    /** TODO: Validar token y comprobar si es el usuario correcto. */

    /** Obtener el valor de los parametros URL */
    const id = req.params.id;
    const uid = req.uid

    /** para evitar posibles errores */
    try {
        /**  Consultar el usuario por id */
        const hospitalDB = await Hospital.findById(id);

        /** valdiar si el hospital no existe */
        if (!hospitalDB) {
            /** responder el estado y mensaje formato json */
            return res.status(404).json({
                ok: false,
                msg: 'No existe un hospital con esa identificación.'
            });
        }

        /** Se selecciona todos los campos de body */
        /** Desectructura los campos recibidos por el body para extraer los ...campos se obtine todos los demás campos del modelo */
        const campos = {
            ...req.body,
            usuario: uid
        };

        /**  actualiza el hospital y devuelve el nuevo valor */
        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, campos, { new: true });

        /**  cuando la respuesta es ok */
        res.json({
            ok: true,
            hospital: hospitalActualizado
        });
        /**  Si lapetición esta mal mostrar el error. */
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, hable con el administrador '
        });
    }
};

/**  DELETE Hospital */
const borrarHospital = async(req, res = response) => {

    /** Obtener el valor de los parametros  URL */
    const id = req.params.id;
    try {
        /** Consultar el hospital por id */
        const hospitalDB = await Hospital.findById( id );

        /** valdiar si el hospital no existe */
        if (!hospitalDB) {
            /** responder el estado y mensaje formato json */
            return res.status(404).json({
                ok: false,
                msg: 'No existe un hospital con esa identificación.'
            });
        }

        /** Elimina el hospital referente al id */
        await Hospital.findByIdAndDelete( id );

        /** Si realizo correctamente la elimincación */
        res.json({
            ok: true,
            msg: 'Hospital eliminado.'
        });

        /** Si lapetición esta mal mostrar el error. */
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, Hable con el administrador'
        });
    }
};

/** esportar los metodos o modulos del controlador. */
module.exports = {
    getHospitales: getHospitales,
    crearHospital: crearHospital,
    actualizarHospital: actualizarHospital,
    borrarHospital: borrarHospital
};