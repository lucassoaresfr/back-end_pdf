console.log('Iniciando o servidor...');

require('dotenv').config();
const express = require('express');
const pdfRoutes = require('./src/routes/pdfRouter.js');
const cors = require('cors');

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use('/pdf.pdf', pdfRoutes);

app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}.`);
});