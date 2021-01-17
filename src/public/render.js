import { socket } from './socket.js';

import {
    restoreAnnot
} from './annot.js'

export var pageNumber = 1;
export var rendering = false;
var toRender = 0;
export var max = 1;
var pageIpt = document.getElementById("pageIpt");
export let sizeX = 0;
export let sizeY = 0;

var doc = 'uploads/'+document.getElementById("pdf").getAttribute('value');
var pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js';
var loading = pdfjsLib.getDocument(doc);

export var canvas = document.getElementById('viewer');
export var ctx = canvas.getContext('2d');

let numListRendered = false;

export async function draw(x = 0) {
    if (x != 0) {
        pageNumber = x;
    }

    rendering = true;
    pageIpt.value = pageNumber;
    loading.promise.then(function(pdf) {
        pdf.getPage(pageNumber).then(function(page) {
            max = pdf.numPages;

            if (!numListRendered) {
                numListRendered = true;
                for (let i = 1; i <= max; i++) {
                    var elem = document.createElement('option');
                    elem.setAttribute('value', i);
                    elem.innerText = i;
                    pageIpt.appendChild(elem);
                }
            }

            var scale = 1.5;
            var vp = page.getViewport({scale: scale});

            canvas.height = vp.height;
            sizeY = canvas.height
            canvas.width = vp.width;
            sizeX = canvas.width;

            var renderCtx = {
                canvasContext: ctx,
                viewport: vp
            }

            var render = page.render(renderCtx);
            return render.promise.then(function() {
                rendering = false;
                
                if (toRender != 0) {
                    var temp = toRender;
                    toRender = 0;
                    drawPage(temp);
                }
            })
        });
    }, function (reason) {
        // PDF loading error
        console.error(reason);
    });
}

export function drawPage(x) {
    if (x >= 1 && x <= max) {
        if (rendering) {
            toRender = x;
        } else {
            pageNumber = x;
            draw().then(restoreAnnot());
        }
    }
}

export function prevPage() {
    if (pageNumber > 1) {
        pageNumber--;
        drawPage(pageNumber);
    }
}

export function nextPage() {
    if (pageNumber < max) {
        pageNumber++;
        drawPage(pageNumber);
    }
}

export function goTo(x = Number(pageIpt.value)) {
    drawPage(x);
}

let pseudo = document.getElementById("username").innerHTML;
let room = document.getElementById("room").innerHTML;
socket.emit("login", { room: room, pseudo: pseudo});