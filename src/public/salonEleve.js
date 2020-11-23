import {
    pageNumber,
    drawPage,
    prevPage,
    nextPage,
    goTo
} from './render.js'

var etatSuivi = false;
var pageProf = 1;

var socket = io.connect("http://yamazouki.freeboxos.fr");

console.log(document.getElementById("username").innerText);

function rejoindre(){
    drawPage(pageProf);
}

function suivre(){
    if(!etatSuivi){
        etatSuivi = true;
        document.getElementById("follow").innerHTML = "Arreter de suivre";
        drawPage(pageProf);
    }
    else{
        etatSuivi = false;
        document.getElementById("follow").innerHTML = "Suivre";
    }
}

socket.on('page', function(data){
    if(data != pageNumber && etatSuivi == true){
        drawPage(data);
        pageProf = data;
    }
    else {
        pageProf = data;
    }
})

document.getElementById("prev").addEventListener("click", prevPage);
document.getElementById("next").addEventListener("click", nextPage);
document.getElementById("go").addEventListener("click", goTo);
document.getElementById("join").addEventListener("click", rejoindre);
document.getElementById("follow").addEventListener("click", suivre);

drawPage(pageNumber);
suivre();
socket.emit('getPage');

