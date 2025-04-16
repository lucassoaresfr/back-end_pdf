const { getProdutos } = require('../entities/produto.js');

async function buscarProdutos() {
    return await getProdutos();
}

module.exports = { buscarProdutos };