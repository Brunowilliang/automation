import puppeteer, { Browser, Page } from 'puppeteer'
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

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('E-mail enviado:', info.response)
  } catch (error: any) {
    console.log('Erro ao enviar o e-mail:', error.message)
  }
}

async function watchMovie() {
  let browser: Browser | null = null

  try {
    browser = await puppeteer.launch({
      // headless: false,
      headless: true,
      args: [
        '--disable-setuid-sandbox',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--single-process',
      ],
    })

    for (let i = 0; i < 5; i++) {
      console.log(`Iniciando iteração ${i + 1}`)
      const page = await browser.newPage()
      await navigateAndInteract(page)
      await page.close()
    }

    console.log('Todas as 5 iterações completas')
  } catch (error: any) {
    console.error('Erro durante a execução:', error.message)
    await sendErrorEmail(error)
  } finally {
    if (browser) await browser.close()
  }
}

async function navigateAndInteract(page: Page) {
  await page.goto('https://www.cineflix.app/', { waitUntil: 'networkidle2' })

  // Calcula o ponto central e clica
  const width = page.viewport()?.width || 800
  const height = page.viewport()?.height || 600
  await page.mouse.click(width / 2, height / 2)

  // Aguarda a tela de anúncio ser carregada
  // await page.waitForNavigation({ waitUntil: 'networkidle2' })

  // Esperar que o anúncio seja carregado
  console.log('Esperando anúncio ser carregado')
  await new Promise((resolve) => setTimeout(resolve, 5000))
}

watchMovie()
