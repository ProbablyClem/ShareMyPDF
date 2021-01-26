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
let room = document.getElementById("room").innerHTML;

console.log(document.getElementById("username").innerText);

function rejoindre(){
    drawPage(pageProf);
    restoreAnnot();
}

function suivre(){
    var btn = document.getElementById("follow");
    if(!etatSuivi){
        etatSuivi = true;
        btn.innerHTML = "Arreter de suivre";
        btn.classList.add('btn-danger');
        btn.classList.remove('btn-success');

        drawPage(pageProf);
        restoreAnnot();
    }
    else{
        etatSuivi = false;
        btn.innerHTML = "Suivre";
        btn.classList.add('btn-success');
        btn.classList.remove('btn-danger');
    }
}

socket.on('page', function(data){
    //console.log("Page: "+data);
    if(data != pageNumber && etatSuivi == true){
        drawPage(data);
        restoreAnnot();
    }
    pageProf = data;
})

document.getElementById("prev").addEventListener("click", prevPage);
document.getElementById("next").addEventListener("click", nextPage);
document.getElementById("pageIpt").addEventListener("change", () => goTo());
document.getElementById("join").addEventListener("click", rejoindre);
document.getElementById("follow").addEventListener("click", suivre);

drawPage(pageNumber);
suivre();
socket.emit('getPage', room);

