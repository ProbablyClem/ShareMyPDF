import { socket } from "./socket.js"



socket.onmessage = function(event){
    console.log("Message reçu : ", event);
}