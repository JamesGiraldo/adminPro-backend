const mongoose = require('mongoose');

// usuario_mongoDB_nube: james_giraldo
// password_mongoDB_nube: james1234891171

const dbContection = async() => {
    try {
        await mongoose.connect(`${ process.env.BD_CNN }`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('¡BD Online!');
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la BD ver logs');
    }

}

module.exports = {
    dbContection: dbContection
}