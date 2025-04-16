# Use uma imagem base do Node.js
FROM node:20-slim

# Instale as dependências do Puppeteer, Chromium e unzip
RUN apt-get update && apt-get install -y \
  wget \
  unzip \
  ca-certificates \
  libx11-dev \
  libgbm-dev \
  libgtk-3-0 \
  libnss3 \
  libasound2 \
  fonts-liberation \
  libappindicator3-1 \
  libxss1 \
  libxtst6 \
  libgdk-pixbuf2.0-0 \
  libnspr4 \
  libaio1 \
  unzip \
  libssl3 \
  libxml2 \
  && apt-get clean

# Instalar dependências do Node.js
WORKDIR /usr/src/app
COPY . .

# Baixar o Oracle Instant Client diretamente
RUN mkdir -p /opt/oracle && \
    cd /opt/oracle && \
    wget https://download.oracle.com/otn_software/linux/instantclient/2113000/instantclient-basic-linux.x64-21.13.0.0.0dbru.zip && \
    unzip instantclient-basic-linux.x64-21.13.0.0.0dbru.zip && \
    ln -s /opt/oracle/instantclient_21_13 /opt/oracle/instantclient && \
    echo /opt/oracle/instantclient > /etc/ld.so.conf.d/oracle-instantclient.conf && \
    ldconfig

# Define variáveis de ambiente necessárias
ENV LD_LIBRARY_PATH=/opt/oracle/instantclient
ENV PATH=$PATH:/opt/oracle/instantclient

# Instala dependências do projeto Node
RUN npm install

# Exponha a porta que o seu servidor vai rodar
EXPOSE 3546

# Comando para iniciar o servidor
CMD ["node", "app.js"]