import express from "express"
import http from "http";
import { Server } from 'socket.io';
import moment from "moment";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let turnoActual = 0;
let turnos = [];
let turnosDia = {};


io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    //Acá envia estos datos al cliente
    socket.emit('turnoActual', turnoActual);
    socket.emit('turnoCola', turnos.slice(-3));
    socket.emit('turnosDia', turnosDia);

    //Crea los turnos y les pone la fecha actual
    socket.on('turnoSiguiente', () => {
        turnoActual++;
        const today = moment().format('YYYY-MM-DD');
        
        // Crear el objeto de turno y añadirlo al arreglo de turnos
        const turno = { number: turnoActual, timestamp: today };
        turnos.push(turno);

        turnosDia[today] = (turnosDia[today] || 0) + 1;

        io.emit('turnoActual', turnoActual);
        io.emit('turnoCola', turnos.slice(-3));
        io.emit('turnosDia', turnosDia);
        //Se escucha la notificacion
        io.emit('playSound');
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

server.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
