//importamos mongoose
const mongoose = require('mongoose');

const dbConnection = async() =>{

    try{
        //Esto retorna una promesa

        await mongoose.connect( process.env.DB_CNN,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('DB Online');
    

    } catch(error) {
        console.log(error);
        throw new Error('Error a la hora de inicializar BD');
    }
}

//Exportamos la coneccion 
module.exports = {
    dbConnection
}