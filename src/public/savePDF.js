import {
    restoreAnnot,
    annotState
} from './annot.js';
import {
    canvas,
    drawPage,
    max,
    rendering,
    sizeX,
    sizeY,
    draw,
    pageNumber,
    goTo
} from './render.js';

const jspdf = window.jspdf;
var progress;
var progressCardText;
var doc;
var w;
var h;

let oldPage;
let cancel;

var body = document.getElementsByTagName('body')[0];
var progressBackground;

function addToPDF(x) {
    if (cancel) {
        goTo(oldPage);
        restoreAnnot();
        return;
    }

    if (x <= max) {
        progress.setAttribute('value', x);
        progressCardText.innerText = "Création du PDF en cours, étape " + x + "/" + max;
    
        draw(x).then(() => {
            
            var interAdd = setInterval(async () => {
                if (!rendering) {
                    restoreAnnot().then(() => {
                        var interAnnot = setInterval(async () => {
                            if (!annotState) {
                                doc.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, w, h);
                            
                                if (x+1 <= max) doc.addPage();
                                addToPDF(x + 1);


                                clearInterval(interAnnot);
                            }
                            
                        })
                    });
                    clearInterval(interAdd);
                }
            }, 100);
        });
    } else {
        const pdf_name = "annot_" + document.getElementById('pdf').getAttribute('value');
        doc.save(pdf_name);
    }
}

async function saveToPDF() {
    doc = new jspdf.jsPDF((sizeX > sizeY ? 'l' : 'p'), 'pt', [sizeX, sizeY]);

    w = doc.internal.pageSize.getWidth();
    h = doc.internal.pageSize.getHeight();
    
    oldPage = pageNumber;
    cancel = false;

    progressBackground = document.createElement('div');
    progressBackground.classList.add('position-fixed', 'top-0', 'start-0', 'w-100', 'h-100');
    progressBackground.style.background = "#000000c0";
    progressBackground.style.zIndex = "40"

    var progressCard = document.createElement('div');
    progressCard.classList.add('position-absolute', 'top-50', 'start-50', 'translate-middle', 'card', 'text-center');

    var progressCardHeader = document.createElement('div')
    progressCardHeader.classList.add('card-header');
    progressCardHeader.innerText = "Génération du PDF";
    
    var progressCardClose = document.createElement('button');
    progressCardClose.classList.add('btn-close', 'position-absolute', 'end-0', 'mx-2');
    progressCardClose.addEventListener('click', endSave);

    var progressCardBody = document.createElement('div')
    progressCardBody.classList.add('card-body');
    
    progressCardText = document.createElement('span');
    progressCardText.innerText = "Création du PDF en cours, étape 0/" + max;

    progress = document.createElement('progress');
    progress.classList.add('w-100');
    progress.setAttribute('value', 0);
    progress.setAttribute('max', max);
    
    body.appendChild(progressBackground);
    progressBackground.appendChild(progressCard);
    progressCard.appendChild(progressCardHeader);
    progressCardHeader.appendChild(progressCardClose);
    progressCard.appendChild(progressCardBody);
    progressCardBody.appendChild(progressCardText);
    progressCardBody.appendChild(document.createElement('br'));
    progressCardBody.appendChild(document.createElement('br'));
    progressCardBody.appendChild(progress);

    addToPDF(1);
}

function endSave() {
    body.removeChild(progressBackground);
    cancel = true;
    goTo(oldPage);
    restoreAnnot();
}

document.getElementById('savePDF').addEventListener('click', saveToPDF);