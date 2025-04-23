const { gerarPdfSeCountMudar, recuperarPdfCache } = require('../services/pdfCacheService.js');
/*const pdfParse = require('pdf-parse');*/

/*async function validarPdf(pdfBuffer) {
    try {
        const data = await pdfParse(pdfBuffer);
        if (data && data.numpages > 0) {
            console.log('PDF é válido e tem páginas.');
            return true;
        } else {
            console.error('PDF é inválido (sem páginas).');
            return false;
        }
    } catch (error) {
        console.error('Falha ao validar o PDF:', error);
        return false;
    }
}*/

async function gerarPdf(req, res) {
  try {
    // 🔁 Sempre verifica se precisa atualizar o PDF
    const novoPdfBuffer = await gerarPdfSeCountMudar();

    if (novoPdfBuffer) {
      console.log('[INFO] Novo PDF gerado e retornado.');
      return res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename=relatorio.pdf',
      }).send(novoPdfBuffer);
    }

    // 🧠 Se não precisou gerar, pega o que está no cache
    const pdfCache = await recuperarPdfCache();

    if (pdfCache) {
      console.log('[INFO] PDF retornado do cache.');
      return res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename=relatorio.pdf',
      }).send(pdfCache);
    }

    // ⚠️ Fallback de segurança
    console.warn('[WARN] Nenhum PDF encontrado ou gerado.');
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

module.exports = { gerarPdf, json };