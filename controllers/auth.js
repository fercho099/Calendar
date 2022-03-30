//Importaciones
const {response, json} = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require ('../models/Usuario');
const {generarJWT} = require('../helpers/jwt');
const jwt = require('jsonwebtoken');
  
//Obtener Usuarios.
const getUsuarios = async ( req, res = response) =>{
     const usuarios = await Usuario.find().populate('name');
     res.json({
         usuarios
     });
}


//Obtener por filtro Usuarios.

const getUsusario = async (req, res = response) =>{

    const usuarioId = req.params.id;
        try {
        
            const usuario = await Usuario.findById(usuarioId);
    
    
            if (!usuario) {
               return res.status(404).json({
                    ok: false,
                    msg: 'Usuario no existe por ese id'
                });
                
            }

            res.json({
                id: usuario.id,
                name: usuario.name,
                email: usuario.email,
                password: usuario.password

            })
    
    
        } catch (error) {
            console.log(error);
            res.status(500).json({
                ok:false,
                msg: 'Hable con el administrador'
            });
        }
}

// CREAR USUARIO

const crearUsuario = async (req, res = response) =>{
    const {email, password} = req.body;

    try {
        let usuario = await Usuario.findOne({email});
        
        if(usuario){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe'
            });
        }

        
        usuario = new Usuario(req.body);

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync( 10 );
        usuario.password = bcrypt.hashSync(password, salt);

        //Guarde el ususario
        await usuario.save();
        

        //Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.status(201).json({ //error 201 create  se cumplio y se creo un nuevo recurso
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token 
        })
        

    } catch (error) {
        console.log(error)
        res.status(500).json({ //error 500 internal server error
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
        
    }
    
}

//LOGIN

const loginUsuario = async (req, res = response) =>{
    
    const {email, password} = req.body;

    try {
        
        const usuario = await Usuario.findOne({email});
        
        if(!usuario){
            return res.status(400).json({ // error 400 peticion incorrecta
                ok: false,
                msg: 'El usuario no existe con ese email'
            });
        }
         //console.log(usuario);
        // confirmar los passwords 
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({  // error 400 peticion incorrecta
                ok: false,
                msg: 'Password incorrecto'
            });
        }

        //Generarr JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
        
    }

}


// const ejemplo = (req, res)=>{
// req.params
// req.body
// req.query

// const  id = req.params.id
// const nombre = req.params.nombre

// const Fecha = req.query.Fecha
// const variableApellido =req.query.Apellido

//}


// Actualizar USUARIO
const actualizarUsuario = async (req, res = response) =>{


    const usuarioId = req.params.id;
    const uid = req.uid;

    try {
        
        const usuario = await Usuario.findById(usuarioId);


        if (!usuario) {
           return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe por ese id'
            });
            
        }
            // console.log('uid :>> ', uid);
            // console.log('usuario :>> ', usuario);
            
        if (usuario._id.toString() !==uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este usuario'
            });
        }   

        

        //obtenemos estos dos campos del body
        const {name,password} = req.body

        //Nueva variable donde almacenaremos los nuevos datos.
        const nuevoUsuario = {
            name,
            password
        }

        //usuario = new Usuario(req.body);
        

        const salt = bcrypt.genSaltSync( 10 );
        nuevoUsuario.password = bcrypt.hashSync(password, salt);

        //Generar nuevo JWT
        // const token = await generarJWT(usuario.id, usuario.name);

        //retornamos el evento actualizado. con el argumento {new: true} que lo muestre al instante 
        const usuarioactualizado = await Usuario.findByIdAndUpdate( usuarioId, nuevoUsuario, {new: true});


        res.json({
            ok: true,
            Usuario: usuarioactualizado,
            msg: 'Por favor vuelva a logearse',
            token
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        });
    }
}

// Eliminar USUARIO

const EliminarUsuario = async (req, res = response) =>{

    const usuarioId = req.params.id;
    const uid = req.uid;

    try {
        
        const usuario = await Usuario.findById(usuarioId);


        if (!usuario) {
           return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe por ese id'
            });
            
        }
            // console.log('uid :>> ', uid);
            //console.log('usuario :>> ', usuario);
            
        if (usuario._id.toString() !==uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este usuario'
            });
        }   

        // 
        await Usuario.findByIdAndDelete(usuarioId);

        res.json({
            ok: true,
            msg: 'Usuario eliminado correctamente'
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        });
    }
}

const revalidrToken = async (req, res = responsees) =>{

    const {uid, name} = req;

    //Generar JWT
    const token = await generarJWT( uid, name);


    res.json({
        ok:true,
        token
    })
}


//Creamos las exportaciones.

module.exports = {
    crearUsuario,
    loginUsuario,
    getUsuarios,
    getUsusario,
    actualizarUsuario,
    EliminarUsuario,
    revalidrToken
}