const puppeteer = require('puppeteer');

test('lance un lecteur prof et un lecteur eleve et change de page', async () => {
    const nav = await puppeteer.launch({
        headless: false
    });

    const pageProf = await nav.newPage();
    const pageEleve = await nav.newPage();

    pageProf.goto('localhost:3000/prof');
    pageEleve.goto('localhost:3000/eleve');

    pageProf.click('button#next');
    pageProf.click('button#prev');
    pageProf.click('button#next');
    pageProf.click('button#next');
})