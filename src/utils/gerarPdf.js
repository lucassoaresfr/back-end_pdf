const puppeteer = require('puppeteer');
require('dotenv').config();

async function gerarPdfPuppeteer() {
    const browser = await puppeteer.launch({
        headless: true, // No modo headless
        args: [
            '--no-sandbox',    // Desabilita o sandbox, necessário para rodar no Docker
            '--disable-setuid-sandbox',  // Desabilita o setuid, que pode gerar erros
            '--disable-dev-shm-usage',  // Para reduzir problemas de memória em contêineres
            '--remote-debugging-port=9222' // Caso precise de depuração remota
        ],
        executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium-browser' // Caminho do Chromium (pode variar dependendo da instalação)
    });
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