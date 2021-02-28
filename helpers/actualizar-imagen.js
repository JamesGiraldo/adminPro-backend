const fs = require('fs');
const Usuario = require('../models/usuarios');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');


/** borra el path o la imagen existente */
const borrarImagen = (path) => {
    /** validar si ya existe el archivo */
    if (fs.existsSync(path)) {
        /**  borrar la imagen anterior */
        fs.unlinkSync(path);
    }
};

/** Actualiza el modelo correspondiente y su campo img para agregar la foto o archivo */
const actualizarImagen = async(tipo, id, nombreArchivo) => {

    /**  variable vacia que hace referencia al path anterior de la imagen de tal modelo */
    let pathViejo = "";

    switch (tipo) {
        case 'medicos':
            /**  Consultar el medico por id */
            const medico = await Medico.findById(id);

            /** validar si no existe el medico */
            if (!medico) {
                console.log('No se encontro médico por id');
                /** no devolver nada. */
                return false;
            }
            /**  obtener el path o ruta  de la imagen del medico anterior */
            pathViejo = `./uploads/medicos/${ medico.img }`;
            /** llamar la función que se encarga de eliminar la foto anterior */
            borrarImagen(pathViejo);
            /** asignar al modelo en el campo img el valor del nombreArchivo */
            medico.img = nombreArchivo;
            /**  Guardar el modelo medico */
            await medico.save();
            /**  devolver verdadero la acción */
            return true;

            break;

        case 'usuarios':
            /**  Consultar el usuario por id */
            const usuario = await Usuario.findById(id);

            /**  validar si no existe el usuario */
            if (!usuario) {
                console.log('No se encontro usuario por id');
                /**  no devolver nada. */
                return false;
            }
            /**  obtener el path o ruta  de la imagen del usuario anterior */
            pathViejo = `./uploads/usuarios/${ usuario.img }`;
            /**  llamar la función que se encarga de eliminar la foto anterior */
            borrarImagen(pathViejo);
            /** asignar al modelo en el campo img el valor del nombreArchivo */
            usuario.img = nombreArchivo;
            /**  Guardar el modelo usuario */
            await usuario.save();
            /**  devolver verdadero la acción */
            return true;

            break;

        case 'hospitales':
            /**  Consultar el hospital por id  */
            const hospital = await Hospital.findById(id);

            /**  validar si no existe el hospital */
            if (!hospital) {
                console.log('No se encontro hospital por id');
                /**  no devolver nada. */
                return false;
            }
            /**  obtener el path o ruta  de la imagen del hospital anterior */
            pathViejo = `./uploads/hospitales/${ hospital.img }`;
            /**  llamar la función que se encarga de eliminar la foto anterior */
            borrarImagen(pathViejo);
            /**  asignar al modelo en el campo img el valor del nombreArchivo */
            hospital.img = nombreArchivo;
            /**  Guardar el modelo hospital */
            await hospital.save();
            /**  devolver verdadero la acción */
            return true;

            break;

        default:
            break;
    }
};

module.exports = {
    actualizarImagen: actualizarImagen
};