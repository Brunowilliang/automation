import puppeteer, { Browser, Page } from 'puppeteer'
import nodemailer from 'nodemailer'

async function sendErrorEmail(error: Error) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'bwgautomation@gmail.com',
      pass: 'moeupzyvtzwkoqpl',
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

  try {
    for (let i = 0; i < 5; i++) {
      const page: Page = await browser.newPage()
      const navigationPromise = page.waitForNavigation({
        waitUntil: 'networkidle0',
      })
      await page.goto('https://www.cineflix.app/')
      await navigationPromise

      // Calcula o ponto central e clica
      const width = page.viewport()?.width || 800
      const height = page.viewport()?.height || 600
      await page.mouse.click(width / 2, height / 2)

      const newTarget = await browser.waitForTarget(
        (target) => target.url() !== 'https://www.cineflix.app/',
      )
      const newPage = await newTarget.page()

      if (newPage) {
        await new Promise((resolve) => setTimeout(resolve, 5000))
        await newPage.close()
      }

      // Aguarda 6 segundos antes do próximo clique
      await new Promise((resolve) => setTimeout(resolve, 6000))

      await page.close()
    }

    await browser.close()
  } catch (error) {
    if (error instanceof Error) {
      console.error('Ocorreu um erro:', error.message)
      await sendErrorEmail(error)
    } else {
      console.error('Ocorreu um erro desconhecido:', error)
    }
    await browser.close()
  }
}

const FIVE_MINUTES = 5 * 60 * 1000 // 5 minutos em milissegundos

function runAndSchedule() {
  watchMovie().then(() => {
    setTimeout(runAndSchedule, FIVE_MINUTES)
  })
}

runAndSchedule()
