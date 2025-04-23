const fetch = require('node-fetch'); // Certifique-se de que 'node-fetch' está instalado

async function getCountRegistros() {
  try {
    const URL = process.env.URL_API;
    const response = await fetch(URL);

    // Se a resposta não for bem-sucedida, lançar um erro
    if (!response.ok) {
      throw new Error(`Resposta inválida da API: ${response.status}`);
    }

    // Extrair o corpo da resposta como JSON
    const data = await response.json();

    console.log('[DEBUG] Resposta da API externa:', data);

    // Agora assumimos que o JSON contém diretamente o valor do "count"
    const count = data; // A resposta contém o número diretamente

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
