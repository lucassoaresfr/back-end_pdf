/*const { gerarPdfSeCountMudar, recuperarPdfCache } = require('../services/pdfCacheService.js');

async function gerarPdf(req, res) {
  try {
    // 🔁 Sempre verifica se precisa atualizar o PDF
    const novoPdfBuffer = await gerarPdfSeCountMudar();

    if (novoPdfBuffer) {
      //console.log('[INFO] Novo PDF gerado e retornado.');
      return res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename=relatorio.pdf',
      }).send(novoPdfBuffer);
    }

    const pdfCache = await recuperarPdfCache();

    if (pdfCache) {
      //console.log('[INFO] PDF retornado do cache.');
      return res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename=relatorio.pdf',
      }).send(pdfCache);
    }

    // ⚠️ Fallback de segurança
    //console.warn('[WARN] Nenhum PDF encontrado ou gerado.');
    res.status(404).send('Nenhum PDF disponível');
    
  } catch (err) {
    console.error('Erro ao gerar o PDF:', err);
    res.status(500).send('Erro ao gerar PDF');
  }
}

module.exports = { gerarPdf };

async function json(req, res) {
    const pdfUrl = process.env.ROTA_PDF;
    res.json({
        url: pdfUrl
    });
}

module.exports = { gerarPdf, json };*/

const { gerarPdfSeCountMudar, recuperarPdfCache } = require('../services/pdfCacheService.js');

async function gerarPdf(req, res) {
  try {
    // 🔁 Tenta gerar um novo PDF se o count mudou
    const novoPdfBuffer = await gerarPdfSeCountMudar();

    if (novoPdfBuffer) {
      return res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename=relatorio.pdf',
      }).send(novoPdfBuffer);
    }

    // 🧠 Caso não tenha sido gerado, tenta recuperar do cache
    const pdfCache = await recuperarPdfCache();

    if (pdfCache) {
      return res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename=relatorio.pdf',
      }).send(pdfCache);
    }

    // ⚠️ Nenhum PDF encontrado
    res.status(404).send('Nenhum PDF disponível');

  } catch (err) {
    console.error('Erro ao gerar o PDF:', err);
    res.status(500).send('Erro ao gerar PDF');
  }
}


async function json(req, res) {
  const pdfUrl = process.env.ROTA_PDF;
  res.json({
    url: pdfUrl
  });
}

module.exports = { gerarPdf, json };
