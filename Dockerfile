FROM ghcr.io/puppeteer/puppeteer:20.9.0

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .

CMD ["npm", "run", "script"]
