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
    draw
} from './render.js';

const jspdf = window.jspdf;
var progress = document.createElement('progress')
progress.setAttribute('id', 'progressPDF');
progress.setAttribute('max', max);
progress.setAttribute('value', 0);
var doc;
var w;
var h;

function addToPDF(x) {
    if (x <= max) {
        progress.setAttribute('value', x);
    
        console.log('avant render ', x);
        draw(x).then(() => {
            
            var interAdd = setInterval(async () => {
                if (!rendering) {
                    restoreAnnot().then(() => {
                        var interAnnot = setInterval(async () => {
                            if (!annotState) {
                                console.log('après render ', x);
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
        doc.save('pdf_annote.pdf');
    }
}

async function saveToPDF() {
    document.getElementById('cont').appendChild(progress);

    doc = new jspdf.jsPDF((sizeX > sizeY ? 'l' : 'p'), 'pt', [sizeX, sizeY]);

    
    w = doc.internal.pageSize.getWidth();
    h = doc.internal.pageSize.getHeight();
    
    console.log(sizeX, sizeY, w, h);

    addToPDF(1);

    progress.remove();
}

document.getElementById('savePDF').addEventListener('click', saveToPDF);