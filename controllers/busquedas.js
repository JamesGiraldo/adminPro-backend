const { response } = require('express');

const Usuario = require('../models/usuarios');
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');

// Get Hospitales
const getBusqueda = async(req, res = response) => {

    // obtener el valor de los parametros de la url
    const busqueda = req.params.busqueda;

    // esto es para realizar la busqueda  sencible :V 
    const regex = new RegExp(busqueda, 'i');


    // para evitar posibles errores
    try {

        // consultar los modelos de una forma simultanea        
        const [usuarios, hospitales, medicos] = await Promise.all([
            Usuario.find({ nombre: regex }),
            Hospital.find({ nombre: regex }),
            Medico.find({ nombre: regex })
        ]);
        // responder con un ok 
        res.json({
            ok: true,
            msg: 'ok',
            usuarios: usuarios,
            hospitales: hospitales,
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

const getDocumentoColeccion = async(req, res = response) => {

    // obtener el valor de los parametros de la url
    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    // esto es para realizar la busqueda  sencible :V 
    const regex = new RegExp(busqueda, 'i');

    let data = [];
    // para evitar posibles errores
    switch (tabla) {
        case 'medicos':
            data = await Medico.find({ nombre: regex })
                .populate('usuario', 'nombre email')
                .populate('hospital', 'nombre email');
            break;
        case 'hospitales':
            data = await Hospital.find({ nombre: regex })
                .populate('usuario', 'nombre email');
            break;
        case 'usuarios':
            data = await Usuario.find({ nombre: regex });

            break;
            // si es un porible error imprimir este mensaje y no permite continuar gracias al return
        default:
            return res.status(400).json({
                ok: false,
                msg: 'La tabla tiene que ser usuarios/medicos/hospitales.'
            });
    }
    // responder con un ok 
    res.json({
        ok: true,
        msg: 'ok',
        resultados: data
    });
    // Si lapetición esta mal mostrar el error.  
};

// esportar los metodo o modulos del controlador.
module.exports = {
    getBusqueda: getBusqueda,
    getDocumentoColeccion: getDocumentoColeccion
};