console.log('Iniciando o servidor...');

require('dotenv').config();
const express = require('express');
const pdfRoutes = require('./src/routes/pdfRouter.js');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 7004;

app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use('/pdf', pdfRoutes);

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor iniciado na porta ${port}.`);
});