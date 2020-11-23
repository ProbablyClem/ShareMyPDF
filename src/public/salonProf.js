import {
    pageNumber,
    drawPage,
    prevPage,
    nextPage,
    goTo
} from './render.js'

var socket = io.connect("http://yamazouki.freeboxos.fr");

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
    socket.emit("page", pageNumber);
}

document.getElementById("prev").addEventListener("click", () => changePage('prev'));
document.getElementById("next").addEventListener("click", () => changePage('next'));
document.getElementById("go").addEventListener("click", () => changePage('go'));

drawPage(pageNumber);
socket.emit("page", pageNumber);