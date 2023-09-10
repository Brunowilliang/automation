# Baseado na imagem oficial do Node.js
FROM node:16

# Define o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copia os arquivos de definição de pacote e instala as dependências
COPY package*.json ./
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Comando para rodar o script quando o contêiner iniciar
CMD [ "npm", "run", "script" ]
