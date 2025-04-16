const oracledb = require('oracledb');
const { conectarBanco } = require('../config/db.js'); // conexão com o banco

async function getCountRegistros(departamento, secao, produto, codfornec, codmarca) {
  const sql = `select COUNT(*) as TOTAL
  from pcest, pcprodut, pcdepto, pcsecao, pctabpr
  where pcest.codprod = pcprodut.codprod
  AND pcprodut.codepto = pcdepto.codepto
  and pcprodut.codsec = pcsecao.codsec
  and pctabpr.codprod = pcprodut.codprod
  and ((pcdepto.codepto)= :DEPARTAMENTO OR :DEPARTAMENTO IS NULL)
  AND (pcsecao.codsec = :SECAO OR :SECAO IS NULL)
  AND (PCPRODUT.CODPROD = :PRODUTO OR :PRODUTO IS NULL)
  AND (PCPRODUT.CODFORNEC = :CODFORNEC OR :CODFORNEC IS NULL)
  AND (PCPRODUT.CODMARCA = :CODMARCA OR :CODMARCA IS NULL)
  AND PCPRODUT.codepto NOT IN (901,400,900)
  AND PCPRODUT.codprod NOT IN (72992)
  AND DECODE(((PCEST.QTESTGER - PCEST.QTBLOQUEADA) - PCEST.QTRESERV), '0', 'N', 'S') = 'S'
  AND ((PCEST.QTESTGER - PCEST.QTBLOQUEADA) - PCEST.QTRESERV) IS NOT NULL
  and pcest.codfilial = 1`;

  const connection = await conectarBanco();

  const binds = {
    DEPARTAMENTO: departamento || null,
    SECAO: secao || null,
    PRODUTO: produto || null,
    CODFORNEC: codfornec || null,
    CODMARCA: codmarca || null
  };

  const result = await connection.execute(sql, binds, { outFormat: oracledb.OUT_FORMAT_OBJECT });

  return result.rows[0].TOTAL;
}

module.exports = { getCountRegistros };
