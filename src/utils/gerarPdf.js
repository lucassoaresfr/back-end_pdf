const puppeteer = require('puppeteer-core');
require('dotenv').config();

async function gerarPdfPuppeteer() {
    const browser = await puppeteer.launch({
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage', 
          '--disable-gpu'            
        ],
        headless: 'new'             
      });
      
      /*const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      */
    

    console.log('Navegador iniciado com sucesso.');

    const page = await browser.newPage();
    console.log('Página criada com sucesso.');

    console.log('Tentando carregar a página...');
    await page.goto(process.env.HTML_PDF, { waitUntil: 'load', timeout: 30000 });
    console.log(process.env.HTML_PDF);

    console.log('Esperando a página carregar...');
    await page.waitForFunction(() => document.readyState === 'complete');
    console.log('Página carregada com sucesso.');

    console.log('Verificando o conteúdo da página...');
    const html = await page.content();
    console.log('Conteúdo da página:', html);


    await page.waitForSelector('#div_table', { visible: true });
    await page.waitForFunction(() => {
        const img = document.querySelector('img');
        return img && img.complete && img.naturalHeight !== 0;
    });

    console.log('Imagem carregada com sucesso.');    

    const pdfBuffer = await page.pdf({ format: 'A4' });

    const buffer = Buffer.from(pdfBuffer);
      
    console.log('Tipo do PDF gerado:', typeof pdfBuffer);
    console.log('É um Buffer?', Buffer.isBuffer(pdfBuffer));
    console.log('Tamanho do PDF gerado:', pdfBuffer.length);

    await browser.close();
    console.log('Navegador fechado.');

    return buffer;
}

module.exports = { gerarPdfPuppeteer };