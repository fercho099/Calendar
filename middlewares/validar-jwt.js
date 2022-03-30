//importaciones
const {response} = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');


const validarJWT = (req, res = response,next ) =>{

    //x-token headerss
    const token = req.header('x-token');


    if(!token){
        return res.status(401).json({
            ok:false,
            msg: 'No hay token en la peticion'
        });
    }

    try {
        
        const {uid, name} = jwt.verify(
            token,
            process.env.SECRET_JWT_SPEED
        );

        //se obtiene en las rutas

        req.uid = uid;
        req.name = name;


    } catch (error) {
        console.log('error :>> ', error);
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        });
    }


    next();

}


module.exports = {
    validarJWT
}


