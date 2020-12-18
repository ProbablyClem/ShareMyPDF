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

let pressed = false;

canvas.addEventListener('mousedown', (e) => {
    pressed = true;
    annotPoint(e.pageX, e.pageY);
    addPoint(e.pageX, e.pageY);
    socket.emit('annotPoint', { 'x' : e.pageX, 'y' : e.pageY});
});

canvas.addEventListener('mouseup', (e) => {
    if (pressed) {
        pressed = false;
        socket.emit('annot', annotations[pageNumber-1][annotations[pageNumber-1].length - 1]);
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (pressed) {
        annotLine(e.pageX, e.pageY);
        addLine(e.pageX, e.pageY)
        socket.emit('annotLine', { 'x' : e.pageX, 'y' : e.pageY});
    }
});

canvas.addEventListener('mouseleave', (e) => {
    if (pressed) {
        pressed = false;
    }
})

document.getElementById("clear").addEventListener('click', () => {
    clearPage();
    socket.emit('clear');
});

socket.on('allAnnot', (data) => {
    setAnnot(data);
    restoreAnnot();
})

socket.emit('getAllAnnot');