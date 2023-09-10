# Usar a imagem oficial do Puppeteer
FROM ghcr.io/puppeteer/puppeteer:latest

# Definir o diretório de trabalho
WORKDIR /app

# Copiar o package.json e package-lock.json (se disponível)
COPY package*.json ./

# Instalar as dependências do projeto
RUN npm install

# Copiar o restante dos arquivos do projeto
COPY . .

# Comando para executar o script
CMD ["npm", "run", "script"]
