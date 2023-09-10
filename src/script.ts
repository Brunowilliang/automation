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
  // const browser: Browser = await puppeteer.launch({ headless: false })
  const browser: Browser = await puppeteer.launch({
    headless: 'new',
    executablePath: puppeteer.executablePath(),
    args: [
      '--disable-setuid-sandbox',
      '--no-sandbox',
      '--single-process',
      '--no-zygote',
    ],
  })

  for (let i = 0; i < 5; i++) {
    console.log(`Iniciando iteração ${i + 1}`)

    try {
      // const page = await browser.newPage()
      // await page.goto('https://www.cineflix.app/')

      const page = await browser.newPage()
      await page.goto('https://www.cineflix.app/')
      await page.waitForNavigation({ waitUntil: 'load' })

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

// const ONE_MINUTE = 1000 * 60

// function runAndSchedule() {
//   watchMovie().then(() => {
//     setTimeout(runAndSchedule, ONE_MINUTE)
//   })
// }

// runAndSchedule()

watchMovie()
