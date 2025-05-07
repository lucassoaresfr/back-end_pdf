/*const { client } = require('../config/redisConnect.js');
const { gerarPdfPuppeteer } = require('../utils/gerarPdf.js');
const { getCountRegistros } = require('../entities/pdfRedis.js');

const PDF_CACHE_KEY = 'pdf_cache';
const COUNT_CACHE_KEY = 'pdf_count';

async function gerarPdfSeCountMudar() {
  try {
    const countAtual = await getCountRegistros();

    // Usando pipeline para buscar as chaves de uma vez
    const pipeline = client.pipeline();
    pipeline.get(PDF_CACHE_KEY);
    pipeline.get(COUNT_CACHE_KEY);
    const [pdfBase64, countSalvoStr] = await pipeline.exec();

    const countSalvo = countSalvoStr !== null ? Number(countSalvoStr) : null;

    const precisaGerarPdf =
      !pdfBase64 || countSalvo === null || countSalvo !== countAtual;

    if (!precisaGerarPdf) {
      //console.log('[INFO] Count não mudou e PDF já existe no cache.');
      return null;
    }

    const pdfBuffer = await gerarPdfPuppeteer();
    const buffer = Buffer.isBuffer(pdfBuffer)
      ? pdfBuffer
      : Buffer.from(pdfBuffer);

    await client.set(PDF_CACHE_KEY, buffer);
    await client.set(COUNT_CACHE_KEY, countAtual.toString());

    //console.log('[INFO] PDF gerado e salvo no cache com novo count.');
    return buffer;
  } catch (err) {
   // console.error('[ERRO] Falha ao verificar ou salvar PDF no cache:', err);
    throw err;
  }
}

async function recuperarPdfCache() {
  try {
    const base64Data = await client.get(PDF_CACHE_KEY);
    if (!base64Data) return null;
    return Buffer.from(base64Data, 'base64');
  } catch (err) {
    //console.error('[ERRO] Falha ao recuperar PDF do Redis:', err);
    return null;
  }
}

module.exports = { gerarPdfSeCountMudar, recuperarPdfCache };*/

const { client } = require('../config/redisConnect.js');
const { gerarPdfPuppeteer } = require('../utils/gerarPdf.js');
const { getCountRegistros } = require('../entities/pdfRedis.js');

const PDF_CACHE_KEY = 'pdf_cache';
const COUNT_CACHE_KEY = 'pdf_count';

async function gerarPdfSeCountMudar() {
  try {
    const countAtual = await getCountRegistros();

    // Recupera os dois valores do Redis
    const pipeline = client.multi();
    pipeline.getBuffer(PDF_CACHE_KEY);
    pipeline.get(COUNT_CACHE_KEY);
    const [[, pdfBuffer], [, countSalvoStr]] = await pipeline.exec();

    const countSalvo = countSalvoStr !== null ? Number(countSalvoStr) : null;

    const precisaGerarPdf =
      !pdfBuffer || countSalvo === null || countSalvo !== countAtual;

    if (!precisaGerarPdf) {
      // PDF no cache está atualizado
      return null;
    }

    const novoPdf = await gerarPdfPuppeteer();
    const buffer = Buffer.isBuffer(novoPdf)
      ? novoPdf
      : Buffer.from(novoPdf);

    // Salva o novo PDF e novo count no Redis
    await client.set(PDF_CACHE_KEY, buffer);
    await client.set(COUNT_CACHE_KEY, countAtual.toString());

    return buffer;
  } catch (err) {
    throw err;
  }
}

async function recuperarPdfCache() {
  try {
    // Usando getBuffer para recuperar o PDF diretamente como Buffer
    const buffer = await client.getBuffer(PDF_CACHE_KEY);
    if (!buffer) return null;
    return buffer; // Retorna o Buffer diretamente
  } catch (err) {
    console.error('[ERRO] Falha ao recuperar PDF do Redis:', err);
    return null;
  }
}

module.exports = { gerarPdfSeCountMudar, recuperarPdfCache };

