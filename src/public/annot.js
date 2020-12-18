import {
    canvas,
    ctx,
    pageNumber,
    rendering,
    drawPage
} from './render.js'
import { socket } from './socket.js';

export {
    canvas,
    pageNumber
}

let room = document.getElementById("room").innerHTML;

let lastX, lastY;
export const pos = canvas.getBoundingClientRect();
const DEF_WIDTH = 10;
const DEF_COLOR = "#ff0000"

export let annotations = [];

export function annotObj(obj) {
    const data = obj[pageNumber-1];
    
    data.forEach(trait => {
        annotPoint(trait[0].x, trait[0].y);

        for (let i = 1; i < trait.length; i++) {
            annotLine(trait[i].x, trait[i].y);
        }
    });
}

export function annotPoint(x, y) {
    ctx.beginPath();
    ctx.arc(x - pos.left, y - pos.top, DEF_WIDTH / 2, 0, 2 * Math.PI, false);
    ctx.fillStyle = DEF_COLOR;
    ctx.fill();
    ctx.closePath();

    lastX = x;
    lastY = y;
}

export function annotLine(x, y) {
    ctx.beginPath();
    ctx.lineWidth = DEF_WIDTH;
    ctx.strokeStyle = DEF_COLOR;
    ctx.moveTo(lastX - pos.left, lastY - pos.top);
    ctx.lineTo(x - pos.left, y - pos.top);
    ctx.stroke();
    ctx.closePath();

    annotPoint(x, y);

    lastX = x;
    lastY = y;
}

export function restoreAnnot() {
    if (annotations[pageNumber-1] !== undefined) {
        // on attend ici le render
        var timerRender = setInterval(() => {
            if (!rendering) {
                if (annotations[pageNumber-1] !== undefined) {
                    annotObj(annotations);
                    clearInterval(timerRender);
                }
            }
        }, 1);
    }
}

export function setAnnot(obj) {
    annotations = obj;
}

export function addPoint(x, y, page = pageNumber) {
    if (annotations[page-1] === undefined) {
        annotations[page-1] = [];
    }
    annotations[page-1][annotations[page-1].length] = [];
    annotations[page-1][annotations[page-1].length-1].push({ 'x' : x, 'y' : y });
}

export function addLine(x, y, page = pageNumber) {
    annotations[page-1][annotations[page-1].length-1].push({ 'x' : x, 'y' : y });
}

export function clearPage(page = pageNumber) {
    if (annotations[page-1] != []) {
        annotations[page-1] = [];
        if (pageNumber == page) {
            drawPage(page);
        }
    }
}

// un peu superflu vu qu'il n'y a que 3 boutons mais bon ça rend le code plus stylé
const btns = document.getElementsByClassName("moveBtn")
for (let btn of btns) {
    btn.addEventListener('click', restoreAnnot);
}