// TODO: instalar nodemon y crear scripts
const http = require('node:http');
const express = require('express');
const cors = require('cors');
const { error } = require('node:console');

// configuroi el .env
require('dotenv').config();

// Creacióin de la app de express
const app = express();
app.use(cors());
app.use(express.json());

// Creamos el server
const server = http.createServer(app);

const PORT = process.env.PORT ?? 3000
server.listen(PORT);

server.on('listening', () =>{
    console.log('Servidor escuchadno el ouerto: ', PORT)
})

server.on('error', () =>{
    console.log('ha ocurrido uin error inesperado')
})

//CONFIG SOCKET.IO
//es un sitema d eventos donde todos los que esten conectados lo recibiran
const io = require('socket.io')(server,{
    cors:{
        origin: '*'
    }
});

io.on('connection', (socket) =>{ //este evento se lanzará cada vez que un cliente se conecte
    console.log('Se ha conectado el cliente', socket.id);

    //AQUI RECIVO EL EVENTO 'mensaje_chat emitido por el front'    
    socket.on('mensaje_chat', (data) =>{ 
        // voy a emitir el mensaje recibido  TODOS los clientes conectados (incluso al que lo ha mandado);
        io.emit('mensaje_chat', data) //AQUI cuando reciva el anterior evento lanzare este evento (ques e llama igual)
    })

    //Este evento emitido se emite a todos menos al que lo ha provocado
    socket.broadcast.emit('mensaje_chat', { 
        username:'INFO',
        message:'Se ha conectado un nuevo usuario'
    })

    //Actualizar el número de clientes conectados
    io.emit('clientes_conectados', io.engine.clientsCount)

    //CUANDO UN CLIENTE SE DESCONECTE SE EJECUITARA
    socket.on('disconnect', () =>{
        io.emit('mensaje_chat', {
            username:'INFO',
            message:`Se ha desconectado uin cliente ${socket.id}`
        })
    })
})