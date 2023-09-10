my app (folder Aplication)
  - node_modules
  - src
    - script.ts 
  - .gitignore
  - package.json

my script.ts
import puppeteer, { Browser } from 'puppeteer'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const userEmail = process.env.EMAIL_USER
const userPass = process.env.EMAIL_PASS

async function sendErrorEmail(error: Error) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: userEmail,
      pass: userPass,
    },
  })

  const mailOptions = {
    from: 'bwgautomation@gmail.com',
    to: 'brunowilliang@icloud.com',
    subject: 'Erro no script Puppeteer',
    text: `Ocorreu um erro no script: ${error.message}`,
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Erro ao enviar o e-mail:', error.message)
    } else {
      console.log('E-mail enviado:', info.response)
    }
  })
}

async function watchMovie() {
  const browser: Browser = await puppeteer.launch({ headless: false })

  for (let i = 0; i < 5; i++) {
    console.log(`Iniciando iteração ${i + 1}`)

    try {
      const page = await browser.newPage()
      await page.goto('https://www.cineflix.app/')

      // Esperar a página carregar por 5 segundos
      await new Promise((resolve) => setTimeout(resolve, 5000))

      // Calcula o ponto central e clica
      const width = page.viewport()?.width || 800
      const height = page.viewport()?.height || 600
      await page.mouse.click(width / 2, height / 2)

      // Esperar que o anúncio seja carregado
      console.log(`Esperando anúncio ser carregado: ${i + 1}`)
      await new Promise((resolve) => setTimeout(resolve, 5000))

      // Fecha todas as páginas
      const pages = await browser.pages()
      for (const pg of pages) {
        await pg.close()
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Erro na iteração ${i + 1}:`, error.message)
        await sendErrorEmail(error)
      } else {
        console.error(`Erro desconhecido na iteração ${i + 1}:`, error)
      }
      await browser.close()
      return // interrompe o loop e a execução do script
    }
  }

  console.log('Todas as 5 iterações completas')
  await browser.close()
}

watchMovie()


my .env
EMAIL_USER=bwgautomation@gmail.com
EMAIL_PASS=moeupzyvtzwkoqpl


my package.json
{
  "name": "server",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "engines": {
    "node": "18"
  },
  "scripts": {
    "script": "ts-node src/script.ts",
    "lint": "eslint src --ext .ts --fix"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@flydotio/dockerfile": "^0.3.3",
    "@rocketseat/eslint-config": "^1.2.0",
    "@types/node": "^20.1.5",
    "@types/nodemailer": "^6.4.9",
    "dotenv": "^16.3.1",
    "eslint": "^8.40.0",
    "prisma": "^5.1.1",
    "tsup": "^7.1.0",
    "tsx": "^3.12.7",
    "typescript": "^5.0.4"
  },
  "dependencies": {
    "@fastify/cors": "^8.2.1",
    "@fastify/jwt": "^6.7.1",
    "@fastify/multipart": "^7.6.0",
    "@fastify/static": "^6.10.1",
    "@prisma/client": "^5.1.1",
    "async": "^3.2.4",
    "axios": "^1.4.0",
    "cli-progress": "^3.12.0",
    "fastify": "^4.17.0",
    "iptv-playlist-parser": "^0.12.2",
    "link-check": "^5.2.0",
    "m3u8-parser": "^7.0.0",
    "name-to-imdb": "^3.0.4",
    "nodemailer": "^6.9.5",
    "puppeteer": "^20.9.0",
    "ts-node": "^10.9.1",
    "zod": "^3.21.4"
  }
}


# # Usar a imagem oficial do Puppeteer
# FROM ghcr.io/puppeteer/puppeteer:20.9.0

# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true \
#     PUPPETEER_EXECUTABLE_PATH /usr/bin/google-chrome-stable

# # Definir o diretório de trabalho
# WORKDIR /app

# # Copiar o package.json e package-lock.json (se disponível)
# COPY package*.json ./

# # Mudar para o usuário root para instalar dependências
# USER root

# # Instalar as dependências do projeto
# RUN npm ci

# # Mudar de volta para o usuário padrão do Puppeteer
# USER pptruser

# # Copiar o restante dos arquivos do projeto
# COPY . .

# # Comando para executar o script
# CMD ["npm", "run", "script"]