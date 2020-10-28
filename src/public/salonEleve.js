var pageNumber = 1;
var max = 1;
var etatSuivi = false;
var pageProf = 1;
var pageIpt = document.getElementById("pageInput");

var doc = 'example.pdf';
var pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js';
var loading = pdfjsLib.getDocument(doc);

var canvas = document.getElementById('viewer');
var ctx = canvas.getContext('2d');

var socket = io.connect("http://localhost:3000");


function draw() {
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
        });
    }, function (reason) {
        // PDF loading error
        console.error(reason);
    });
}

function drawPage(x) {
    if (x >= 1 && x <= max) {
        pageNumber = x;
        socket.emit("page", pageNumber);
        draw();
    }
}

function prevPage() {
    if (pageNumber > 1) {
        pageNumber--;
        drawPage(pageNumber);
    }
}

function nextPage() {
    if (pageNumber < max) {
        pageNumber++;
        drawPage(pageNumber);
    }
}

function goTo() {
    var x = Number(pageIpt.value);
    drawPage(x);
}

function rejoindre(){
    drawPage(pageProf);
}

function suivre(){
    console.log(etatSuivi);
    if(!etatSuivi){
        etatSuivi = true;
        document.getElementById("boutonSuivre").innerHTML = "Arreter de suivre";
        drawPage(pageProf);
    }
    else{
        etatSuivi = false;
        document.getElementById("boutonSuivre").innerHTML = "Suivre";
    }
}

draw();



socket.on('page', function(data){
    if(data != pageNumber && etatSuivi == true){
        drawPage(data);
        pageProf = data;
    }
    else {
        pageProf = data;
    }
})