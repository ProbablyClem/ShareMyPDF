import {
    pageNumber,
    drawPage,
    prevPage,
    nextPage,
    goTo
} from './render.js'

import { socket } from './socket.js';

import { restoreAnnot } from './annot.js';

var etatSuivi = false;
export var pageProf = 1;

console.log(document.getElementById("username").innerText);

function rejoindre(){
    drawPage(pageProf);
    restoreAnnot();
}

function suivre(){
    if(!etatSuivi){
        etatSuivi = true;
        document.getElementById("follow").innerHTML = "Arreter de suivre";
        drawPage(pageProf);
        restoreAnnot();
    }
    else{
        etatSuivi = false;
        document.getElementById("follow").innerHTML = "Suivre";
    }
}

socket.on('page', function(data){
    if(data != pageNumber && etatSuivi == true){
        drawPage(data);
        restoreAnnot();
    }
    pageProf = data;
})

document.getElementById("prev").addEventListener("click", prevPage);
document.getElementById("next").addEventListener("click", nextPage);
document.getElementById("go").addEventListener("click", goTo);
document.getElementById("join").addEventListener("click", rejoindre);
document.getElementById("follow").addEventListener("click", suivre);

drawPage(pageNumber);
suivre();
socket.emit('getPage');

