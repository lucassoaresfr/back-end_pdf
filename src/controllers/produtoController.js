const { buscarProdutos } = require('../services/produtosService.js')

async function listarProdutos(req, res) {
    try {
        const produtos = await buscarProdutos();
        res.json(produtos);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
}

module.exports = {listarProdutos};