import {
    pageNumber,
    drawPage,
    prevPage,
    nextPage,
    goTo
} from './render.js'

import { socket } from './socket.js';

let pseudo = document.getElementById("username").innerHTML;
let room = document.getElementById("room").innerHTML;

function changePage(fn) {
    switch (fn) {
        case 'prev' :
            prevPage()
            break;
        case 'next' :
            nextPage()
            break;
        case 'go' :
            goTo()
            break;
        default:
            console.error("La fonction n'est pas reconnue");
    }
    socket.emit("page", {room: room, page: pageNumber});
}

document.getElementById("prev").addEventListener("click", () => changePage('prev'));
document.getElementById("next").addEventListener("click", () => changePage('next'));
document.getElementById("go").addEventListener("click", () => changePage('go'));

drawPage(pageNumber);
console.log(room);
socket.emit("page", {room: room, page: pageNumber});