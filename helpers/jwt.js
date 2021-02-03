const jwt = require('jsonwebtoken');

const generarJWT = (uid) => {

    return new Promise((resolve, reject) => {

        // peilor campos que quiera en token
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

module.exports = {
    generarJWT: generarJWT
};