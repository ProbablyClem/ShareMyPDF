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
    clearPage,
    DEF_COLOR,
    DEF_WIDTH
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

function getColor() {
    return document.getElementById('color').value;
}

function getWidth() {
    return document.getElementById('width').value;
}

canvas.addEventListener('mousedown', (e) => {
    const pos = canvas.getBoundingClientRect();
    const x = e.pageX - (pos.left + window.scrollX);
    const y = e.pageY - (pos.top + window.scrollY);
    annotPoint(x, y, getColor(), getWidth());
    addPoint(x, y, getColor(), getWidth());
    socket.emit('annotPoint', { room: room, data: {'x' : x, 'y' : y, 'color' : getColor(), 'width' : getWidth()}});
});

canvas.addEventListener('mouseup', (e) => {
    socket.emit('annot', {room: room, data : annotations[pageNumber-1][annotations[pageNumber-1].length - 1]});
});

canvas.addEventListener('mousemove', (e) => {
    if (pressed) {
        const pos = canvas.getBoundingClientRect();
        const x = e.pageX - (pos.left + window.scrollX);
        const y = e.pageY - (pos.top + window.scrollY);
        annotLine(x, y, getColor(), getWidth());
        addLine(x, y, getColor(), getWidth());
        socket.emit('annotLine', {room: room, data: { 'x' : x, 'y' : y, 'color' : getColor(), 'width' : getWidth()}});
    }
});

canvas.addEventListener('mouseenter', (e) => {
    if (pressed) {
        const pos = canvas.getBoundingClientRect();
        const x = e.pageX - (pos.left + window.scrollX);
        const y = e.pageY - (pos.top + window.scrollY);
        annotPoint(x, y, getColor(), getWidth());
        addPoint(x, y, getColor(), getWidth());
        socket.emit('annotPoint', { room: room, data: {'x' : x, 'y' : y, 'color' : getColor(), 'width' : getWidth()}});
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