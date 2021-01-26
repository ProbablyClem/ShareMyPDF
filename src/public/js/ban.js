import { socket } from "./socket.js";

let username = document.getElementById("username").innerHTML;
let room = document.getElementById("room").innerHTML;
socket.on('ban',function(data){
    if(username == data){
        window.location.href =  window.location.origin + "/ban/" + room;
    }
});