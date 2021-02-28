const jwt = require('jsonwebtoken');

/** generar token recibiendo el id correspondiente */
const generarJWT = (uid) => {

    return new Promise((resolve, reject) => {

        /** peilor campos que quiera en token */
        const payload = {
            uid
        };

        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '12h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se puedo generar el token.');
            } else {
                resolve(token);
            }

        });
    });

};
/** esportar los metodos declarados */
module.exports = {
    generarJWT: generarJWT
};