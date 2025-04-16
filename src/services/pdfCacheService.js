const { client } = require('../config/redisConnect.js');
const { gerarPdfPuppeteer } = require('../utils/gerarPdf.js');
const { getCountRegistros } = require('../entities/pdfRedis.js');

const PDF_CACHE_KEY = 'pdf_cache';
const COUNT_CACHE_KEY = 'pdf_count';

async function gerarPdfSeCountMudar() {
  try {
    const countAtual = await getCountRegistros();

    const [pdfBase64, countSalvoStr] = await Promise.all([
      client.get(PDF_CACHE_KEY),
      client.get(COUNT_CACHE_KEY)
    ]);

    const countSalvo = countSalvoStr !== null ? Number(countSalvoStr) : null;

    const precisaGerarPdf =
      !pdfBase64 || countSalvo === null || countSalvo !== countAtual;

    if (!precisaGerarPdf) {
      console.log('[INFO] Count não mudou e PDF já existe no cache.');
      return null;
    }

    const pdfBuffer = await gerarPdfPuppeteer();
    const buffer = Buffer.isBuffer(pdfBuffer)
      ? pdfBuffer
      : Buffer.from(pdfBuffer);

    const base64Data = buffer.toString('base64');
    await client.set(PDF_CACHE_KEY, base64Data);
    await client.set(COUNT_CACHE_KEY, countAtual.toString());

    console.log('[INFO] PDF gerado e salvo no cache com novo count.');
    return buffer;
  } catch (err) {
    console.error('[ERRO] Falha ao verificar ou salvar PDF no cache:', err);
    throw err;
  }
}

async function recuperarPdfCache() {
  try {
    const base64Data = await client.get(PDF_CACHE_KEY);
    if (!base64Data) return null;
    return Buffer.from(base64Data, 'base64');
  } catch (err) {
    console.error('[ERRO] Falha ao recuperar PDF do Redis:', err);
    return null;
  }
}

module.exports = { gerarPdfSeCountMudar, recuperarPdfCache };