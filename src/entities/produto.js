const oracledb = require('oracledb');
require('dotenv').config(); // Para carregar variáveis do .env
const { conectarBanco } = require('../config/db.js'); // <-- novo

async function getProdutos() {
  let connection;
  try {
    connection = await conectarBanco(); // Reutiliza a conexão centralizada

    // Executar a consulta SQL
    const result = await connection.execute(
      `SELECT (pcest.codprod||' - '||pcprodut.descricao) PRODUTO, pcprodut.embalagem,
             pcprodut.unidade, 
             ((PCEST.QTESTGER-PCEST.QTBLOQUEADA)-PCEST.QTRESERV) QTDISPONIVEL, 
             pcprodut.codepto, pcdepto.descricao AS depto, pcprodut.codsec, 
             pcsecao.descricao AS secao
      FROM pcest
      JOIN pcprodut ON pcest.codprod = pcprodut.codprod
      JOIN pcdepto ON pcprodut.codepto = pcdepto.codepto
      JOIN pcsecao ON pcprodut.codsec = pcsecao.codsec
      JOIN pctabpr ON pctabpr.codprod = pcprodut.codprod
      WHERE pcprodut.codepto NOT IN (901, 400, 900)
        AND pcprodut.codprod NOT IN (72992)
        AND DECODE(((PCEST.QTESTGER-PCEST.QTBLOQUEADA)-PCEST.QTRESERV), '0', 'N', 'S') = :estoque
        AND ((PCEST.QTESTGER-PCEST.QTBLOQUEADA)-PCEST.QTRESERV) IS NOT NULL
        AND pcest.codfilial = 1
      ORDER BY pcdepto.descricao, pcsecao.descricao, pcprodut.descricao`,
      { estoque: 'S' }, // <-- Aqui você passa o valor esperado
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return result.rows; // Retorna os dados como JSON

  } catch (err) {
    console.error('Erro ao consultar o banco de dados:', err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Erro ao fechar a conexão:', err);
      }
    }
  }
}

module.exports = { getProdutos };