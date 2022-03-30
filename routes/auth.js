/*
Rutas de usuarios / Auth
host + /api/auth
*/

//importaciones
const {Router} = require('express');
const {check} = require('express-validator')
const {validarCampos} = require('../middlewares/validar-campos');
const {crearUsuario, getUsuarios,getUsusario, revalidrToken, loginUsuario, actualizarUsuario,EliminarUsuario} = require('../controllers/auth');
const {validarJWT} =require('../middlewares/validar-jwt');



const router = Router();

router.get('/',getUsuarios);
router.get('/:id',getUsusario);
router.put('/:id',validarJWT,actualizarUsuario);
router.delete('/:id',validarJWT, EliminarUsuario);



//Ruta para crear usuario
router.post(
    '/new',
    [//middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({min: 6 }),
        validarCampos
    ],
    crearUsuario
);


//Ruta para ingresar 
router.post(
    '/', 
    [//middlewares
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({min: 6 }),
        validarCampos
    ],
    loginUsuario
);


router.get('/renew', validarJWT ,revalidrToken);




module.exports = router;