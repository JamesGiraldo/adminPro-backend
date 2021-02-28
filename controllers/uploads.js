const path = require('path');
const fs = require('fs');
const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require("../helpers/actualizar-imagen");

/** Cargar imagen  */
const fileUpload = (req, res = response) => {

    /**  Obtener el tipo por  parametros de la URL */
    const tipo = req.params.tipo;
    /**  Obtener el id por  parametros de la URL */
    const id = req.params.id;

    /** tipos validos  */
    const tipoValidos = ['hospitales', 'medicos', 'usuarios'];

    /**  validar si los tipos no estan */
    if (!tipoValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es un medicos, usuarios u hospitales ( tipo )'
        });
    }
    /** validando que exista un archivo */
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningun Archivo.'
        });
    }

    /**  procesar imagen... */
    const file = req.files.imagen;

    /**  extraer la extensión del archivo */
    const nombreCortado = file.name.split('.'); /** nombre Cortado.jpg */

    /**  extensión(limite) del archivo */
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];

    /**  estensiones validas */
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

    /** validar que las extensiones esten */
    if (!extensionesValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es una extensión permitida.'
        });
    }

    /**  Generar el nombre del archivo */
    const nombreArchivo = `${ uuidv4() }.${extensionArchivo}`;

    /** Crear el path de donde guardar la imagen    */
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    /** Mover la imagen al path o lugar donde uno quiera */
    file.mv(path, (err) => {
        /**  validar el error */
        if (err) {
            console.log('error aquí--> ', err);
            /**  responder con un estado .json el error */
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });
        }

        /**  Actualizar base de datos recibiendo el tipo el id y el nombre del archivo enviado*/
        actualizarImagen(tipo, id, nombreArchivo);

        /** imprimir estado ok  de la imagen */
        res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo: nombreArchivo
        });
    });
};

/** GET retornar imagen a consultar */
const retornaImagen = (req, res = response) => {

    /** obtener el tipo de la url como parametro */
    const tipo = req.params.tipo;
    /** obtener la foto de la url como parametro */
    const foto = req.params.foto;
    /** para consultar el path de la imagen existente */
    const pathImg = path.join(__dirname, `../uploads/${ tipo }/${ foto }`);

    /** Imagen por defecto */
    /** validar si ya existe el archivo */
    if (fs.existsSync(pathImg)) {
        /** responde la imagen o el archivo obtenido */
        res.sendFile(pathImg);
    } else {
        /**  asigna una imagen por defecto en caso tal de que no sea el path correcto */
        const pathImg = path.join(__dirname, `../uploads/no-img.jpg`);
        res.sendFile(pathImg);
    }

};

/**  esportar los metodo o modulos del controlador.*/
module.exports = {
    fileUpload: fileUpload,
    retornaImagen: retornaImagen
};