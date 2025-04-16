console.log('Iniciando o servidor...');

require('dotenv').config();
const express = require('express');
const produtoRoutes = require('./src/routes/produtoRoutes.js');
const pdfRoutes = require('./src/routes/pdfRouter.js');
const cors = require('cors');
const { conectarBanco } = require('./src/config/db.js');

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use('/produtos', produtoRoutes);
app.use('/pdf.pdf', pdfRoutes);

conectarBanco().then(() => {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor rodando`);
  });
})