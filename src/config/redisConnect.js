const Redis = require('ioredis');  // Importando a biblioteca ioredis

// Criando a instância do cliente Redis
const client = new Redis({
  host: process.env.REDIS_HOST || 'redis-pdf',   // Endereço do Redis
  port: process.env.REDIS_PORT || 6379,           // Porta do Redis
});

// Tratando erro de conexão
client.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

// Conectando ao Redis (não é necessário usar o `await client.connect()` com o ioredis)
(async () => {
  try {
    // Teste de conexão para garantir que a conexão seja bem-sucedida
    await client.ping();
    console.log('✅ Connected to Redis');
  } catch (err) {
    console.error('❌ Connection failed:', err);
  }
})();

// Exportando o cliente Redis para uso em outras partes do código
module.exports = { client };