var doc = 'example.pdf';

var pdfjsLib = window['pdfjs-dist/build/pdf'];

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js';

var loading = pdfjsLib.getDocument(doc);

loading.promise.then(function(pdf) {
    var pageNum = 1;

    pdf.getPage(pageNum).then(function(page) {
        var scale = 1.5;
        var vp = page.getViewport({scale: scale});

        var canvas = document.getElementById('viewer');
        var ctx = canvas.getContext('2d');
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