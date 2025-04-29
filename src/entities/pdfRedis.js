const fetch = require('node-fetch'); 

async function getCountRegistros() {
  try {
    const URL = process.env.URL_API;
    const response = await fetch(URL);

    if (!response.ok) {
      throw new Error(`Resposta inválida da API: ${response.status}`);
    }

    
    const data = await response.json();

    console.log('[DEBUG] Resposta da API externa:', data);

    
    const count = data; 

    if (count === undefined) {
      throw new Error('Resposta da API não contém dados válidos de "count"');
    }

    return count;
  } catch (error) {
    console.error('[ERRO] Falha ao buscar count da API externa:', error.message);
    throw error;
  }
}

module.exports = { getCountRegistros };
