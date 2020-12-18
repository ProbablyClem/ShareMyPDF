import {
    annotPoint,
    annotLine,
    restoreAnnot,
    setAnnot,
    addPoint,
    addLine,
    pageNumber,
    clearPage
} from './annot.js';

import { socket } from './socket.js';

import { pageProf } from './renderLect.js';

socket.on('annotPoint', (data) => {
    if (pageNumber == pageProf) {
        annotPoint(data.x, data.y);
    }
    addPoint(data.x, data.y, pageProf);
});

socket.on('annotLine', (data) => {
    if (pageNumber == pageProf) {
        annotLine(data.x, data.y);
    }
    addLine(data.x, data.y, pageProf);
})

socket.on('clear', () => {
    clearPage(pageProf);
})

socket.on('allAnnot', (data) => {
    //console.log("Taille du paquet : " + sizeof(data));
    setAnnot(data);
    restoreAnnot();
})

socket.emit('getPage');
socket.emit('getAllAnnot');