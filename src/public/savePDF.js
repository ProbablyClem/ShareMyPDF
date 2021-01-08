import { restoreAnnot } from './annot.js';
import {
    canvas,
    drawPage,
    max,
    rendering,
    sizeX,
    sizeY
} from './render.js';

const jspdf = window.jspdf;

function showPage(x) {
    console.log('page : ', x);
    drawPage(x);
    restoreAnnot(x);
}

function canvasToImage(x) {
    window.setTimeout(showPage(x), 0);
    return canvas.toDataURL('image/png');
}

function ajouterPage(doc, x) {
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();

    doc.addImage(canvasToImage(x), 'PNG', 0, 0, w, h);
    console.log("add " + x + " to pdf");
}

function saveToPDF() {
    let progress = document.createElement('progress', )
    progress.setAttribute('id', 'progressPDF');
    progress.setAttribute('max', max);
    document.getElementsByTagName('body')[0].appendChild(progress);

    var doc = new jspdf.jsPDF('l', 'pt', [sizeX, sizeY]);

    let i = 1;

    var intervalRender = setInterval(() => {
        if (!rendering) {
            console.log('-----');
            if (i <= max) {
                progress.setAttribute('value', i);
                ajouterPage(doc, i);
                doc.addPage();
                i++
            }

            if (i > max) {
                doc.save('pdf_annote.pdf');
                clearInterval(intervalRender);
            }
        }
    }, 100);

    progress.remove();
}

document.getElementById('savePDF').addEventListener('click', saveToPDF);