const mongoose = require('mongoose');
const colors = require('colors');
/**  usuario_mongoDB_nube: james_giraldo */
/**  password_mongoDB_nube: james1234891171 */

/** realización de conexión de base de datos */
const dbContection = async() => {
    /** captura de errores */
    try {
        await mongoose.connect(process.env.BD_CNN, {
            /**  Recomendaciones de consola por culpa de algunas obsolescensia de Mongoose */
            useFindAndModify: false,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useNewUrlParser: true
        }, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('¡BD Online!'.yellow);
    } catch (error) {
        console.log(`error`.red);
        throw new Error('Error a la hora de iniciar la BD ver logs'.red);
    }
};
/** esportar los metodos declarados */
module.exports = {
    dbContection: dbContection
};