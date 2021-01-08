import {
    canvas,
    annotPoint,
    annotLine,
    restoreAnnot,
    annotations,
    pageNumber,
    addPoint,
    addLine,
    setAnnot,
    clearPage
} from './annot.js'

import { socket } from './socket.js';
let room = document.getElementById("room").innerHTML;

let pressed = false;

window.onmouseup = (e) => {
    pressed = false;
}
window.onmousedown = (e) => {
    pressed = true;
}

canvas.addEventListener('mousedown', (e) => {
    const pos = canvas.getBoundingClientRect();
    const x = e.pageX - pos.left;
    const y = e.pageY - pos.top;
    annotPoint(x, y);
    addPoint(x, y);
    socket.emit('annotPoint', { room: room, data: {'x' : x, 'y' : y}});
});

canvas.addEventListener('mouseup', (e) => {
    socket.emit('annot', {room: room, data : annotations[pageNumber-1][annotations[pageNumber-1].length - 1]});
});

canvas.addEventListener('mousemove', (e) => {
    if (pressed) {
        const pos = canvas.getBoundingClientRect();
        const x = e.pageX - pos.left;
        const y = e.pageY - pos.top;
        annotLine(x, y);
        addLine(x, y)
        socket.emit('annotLine', {room: room, data: { 'x' : x, 'y' : y}});
    }
});

canvas.addEventListener('mouseenter', (e) => {
    if (pressed) {
        const pos = canvas.getBoundingClientRect();
        const x = e.pageX - pos.left;
        const y = e.pageY - pos.top;
        annotPoint(x, y);
        addPoint(x, y);
        socket.emit('annotPoint', { room: room, data: {'x' : x, 'y' : y}});
    }
});

canvas.addEventListener('mouseleave', (e) => {
    if (pressed) {
        socket.emit('annot', {room: room, data : annotations[pageNumber-1][annotations[pageNumber-1].length - 1]});
    }
});

document.getElementById("clear").addEventListener('click', () => {
    clearPage();
    socket.emit('clear', room);
});

socket.on('allAnnot', (data) => {
    setAnnot(data);
    restoreAnnot();
})

socket.emit('getAllAnnot', room);