import {
    pageNumber,
    drawPage,
    prevPage,
    nextPage,
    goTo
} from './render.js'

var socket = io.connect("http://localhost:3000");

var oldPageNumber = 1;

document.getElementById("prev").addEventListener("click", prevPage);
document.getElementById("next").addEventListener("click", nextPage);
document.getElementById("go").addEventListener("click", goTo);

drawPage(pageNumber);

setInterval(() => {
    if (pageNumber != oldPageNumber) {
        oldPageNumber = pageNumber;
        socket.emit("page", pageNumber);
    }
}, 50);