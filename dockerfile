# Imagem base com Node (versão estável)
FROM node:18-slim

# Instalar Chromium e dependências necessárias
RUN apt-get update \
    && apt-get install -y chromium fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Definir variáveis de ambiente para o Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Cria diretório da aplicação
WORKDIR /usr/src/app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala puppeteer-core em vez do puppeteer completo
RUN npm uninstall puppeteer || true \
    && npm install puppeteer-core

# Copia o restante da aplicação
COPY . .

# Porta que o app usa
EXPOSE 3041

# Comando para rodar o app
CMD ["node", "app.js"]