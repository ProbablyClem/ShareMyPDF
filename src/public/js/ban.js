import { socket } from "./socket.js";

let username = document.getElementById("username").innerHTML;
socket.on('ban',function(data){
    if(username == data){
        alert("Vous avez été banni de ce salon.");
        window.location.href = window.location.origin;
    }
});