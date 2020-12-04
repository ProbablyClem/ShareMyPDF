import { socket } from "./socket.js";

var submit = document.getElementById("envoyer").addEventListener("click", ()=>{
    var sujet = getElementById("sujet");
    var contenu = getElementById("contenuQuestion");

    socket.emit('event', { message: sujet+contenu});
});

