const { gerarPdfPuppeteer } = require('../utils/gerarPdf.js')

async function gerarPdfBuffer() {
    return await gerarPdfPuppeteer()
}

module.exports = { gerarPdfBuffer }