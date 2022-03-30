const {Schema, model} = require('mongoose');
//import Schema, model from 'mongoose';

const UsuarioSchema = Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});


//exportamos
module.exports = model( 'Usuario', UsuarioSchema );