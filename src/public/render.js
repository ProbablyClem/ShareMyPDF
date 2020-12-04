export var pageNumber = 1;
export var rendering = false;
var toRender = 0;
var max = 1;
var pageIpt = document.getElementById("pageInput");

var doc = 'uploads/'+document.getElementById("pdf").getAttribute('value');
console.log(doc);
var pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js';
var loading = pdfjsLib.getDocument(doc);

export var canvas = document.getElementById('viewer');
export var ctx = canvas.getContext('2d');

function draw() {
    rendering = true;
    pageIpt.value = pageNumber;
    loading.promise.then(function(pdf) {
        pdf.getPage(pageNumber).then(function(page) {
            max = pdf.numPages;

            var scale = 1.5;
            var vp = page.getViewport({scale: scale});

            canvas.height = vp.height;
            canvas.width = vp.width;

            var renderCtx = {
                canvasContext: ctx,
                viewport: vp
            }

            var render = page.render(renderCtx);
            render.promise.then(function() {
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
            draw();
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

export function goTo() {
    var x = Number(pageIpt.value);
    drawPage(x);
}