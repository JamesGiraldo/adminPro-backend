const { response } = require('express');
const Medico = require('../models/medico');


/** Get Medicos */
const getMedicos = async(req, res = response) => {

    /** para evitar posibles errores */
    try {
        /** Consultar todos los Medicos */
        const medicos = await Medico.find()
            .populate('usuario', 'nombre img')
            .populate('hospital', 'nombre img');

        /** responder con un ok */
        res.json({
            ok: true,
            medicos: medicos
        });

        /** Si lapetición esta mal mostrar el error. */
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado.'
        });
    }
};

/** POST Medico */
const crearMedico = async(req, res = response) => {

    /** Obtener el id de los parametros  URL del token */
    const uid = req.uid;
    /** declarar una constante que almacena el nuevo Medico recibido por el body */
    /** Desestructurar los campos */
    const medico = new Medico({
        usuario: uid,
        ...req.body /** todos los campos que vienen en el body */
    });

    /** para evitar posibles errores */
    try {
        /** guardar el Medico */
        const medicoDB = await medico.save();

        /** Si realizo correctamente el registro */
        res.json({
            ok: true,
            medico: medicoDB
        });

        /** Si lapetición esta mal mostrar el error. */
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar algo.'
        });
    }
};

/** PUT Medico */
const actualizarMedico = async(req, res = response) => {

    /** TODO: Validar token y comprobar si es el usuario correcto. */

    /** Obtener el valor de los parametros URL */
    const id = req.params.id;
    const uid = req.uid;

    /** para evitar posibles errores */
    try {
        /** Consultar el medico por id */
        const medicoDB = await Medico.findById( id );

        /** valdiar si el Medico no existe */
        if (!medicoDB) {
            /** responder el estado y mensaje formato json */
            return res.status(404).json({
                ok: false,
                msg: 'No existe un Medico con esa identificación.'
            });
        }

        /** Se selecciona todos los campos de body */
        /** Desectructura los campos recibidos por el body para extraer los ...campos se obtine todos los demás campos del modelo */
        const campos = {
            ...req.body,
            usuario: uid
        };

        /** actualiza el medico y devuelve el nuevo valor */
        const medicoActualizado = await Medico.findByIdAndUpdate( id, campos, { new: true });

        /**  cuando la respuesta es ok */
        res.json({
            ok: true,
            medico: medicoActualizado
        });
        /** Si lapetición esta mal mostrar el error. */
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado.'
        });
    }
};

/** DELETE Medico */
const borrarMedico = async(req, res = response) => {

    /** Obtener el valor de los parametros  URL */
    const id = req.params.id;
    try {
        /** Consultar el Medico por id */
        const medicoDB = await Medico.findById(id);

        /** valdiar si el Medico no existe */
        if (!medicoDB) {
            /** responder el estado y mensaje formato json */
            return res.status(404).json({
                ok: false,
                msg: 'No existe un Medico con esa identificación.'
            });
        }

        /** Elimina el Medico referente al id */
        await Medico.findByIdAndDelete(id);

        /** Si realizo correctamente la elimincación */
        res.json({
            ok: true,
            msg: 'Medico eliminado.'
        });

        /** Si lapetición esta mal mostrar el error. */
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado...'
        });
    }
};

/** esportar los metoso o modulos del controlador. */
module.exports = {
    getMedicos: getMedicos,
    crearMedico: crearMedico,
    actualizarMedico: actualizarMedico,
    borrarMedico: borrarMedico
};