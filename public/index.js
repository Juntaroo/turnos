var socket = io();

const turnoActualElement = document.getElementById('turnoActual');
const turnoColaElement = document.getElementById('turnoCola');
const turnosDiaElement = document.getElementById('turnosDia');
const turnoSiguiente = document.getElementById('turnoSiguiente');
const notificacion = document.getElementById('sonido');

//Acá recibe el ticket o turno en el que se está actualmente
socket.on('turnoActual', (turnoActual) => {
    turnoActualElement.textContent = `A${turnoActual}`;
});

//Acá recibe el evento y va actualizando los li con el turno que corresponde
socket.on('turnoCola', (turnos) => {
    turnoColaElement.innerHTML = turnos.map(turno => `<li>A${turno.number}</li>`).join('');
});

//Acá recibe el turno con la fecha del dia que se clickeo el boton
socket.on('turnosDia', (turnosDia) => {
    const today = moment().format('YYYY-MM-DD');
    turnosDiaElement.textContent = turnosDia[today] || 0;
});


//Acá muestra el nonido de notificacion
socket.on('playSound', () => {
    notificacion.play();
});

//Acá le estamos indicando al servidor que debe generar el siguiente turno
turnoSiguiente.addEventListener('click', () => {
    socket.emit('turnoSiguiente');
});
