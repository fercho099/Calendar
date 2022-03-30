// importamos 
const jwt = require('jsonwebtoken');



const generarJWT = ( uid, name) => {

    return new Promise( (resolve, reject) => {

        const payload = {uid, name};
                        //Palabra secreta para guardar mis tokens.
        jwt.sign(payload, process.env.SECRET_JWT_SPEED,{
            //Le indicamos que expire en dos horas.
            expiresIn: '2h'
        }, (err, token) => {

            if(err){
                console.log(err);
                reject('No se pudo generar el token');
            }

            resolve(token);
        })

    })

}

module.exports = {
    generarJWT
}