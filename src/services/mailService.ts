/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import nodemailer from 'nodemailer'
import { CONFIG } from '../config'
import { CONSOL } from '../utilities'

const mailHost = CONFIG.smtp.host as string ?? 'smtp.gmail.com'
const mailPort = parseInt(CONFIG.smtp.port as string ?? '465')
const isSecure = CONFIG.smtp.host === 'smtp.gmail.com'

export interface MailInterface {
  from?: string
  to: string | string[]
  cc?: string | string[]
  bcc?: string | string[]
  subject: string
  text?: string
  html?: string
}

export default class MailSevice {
  private static instance: MailSevice

  private readonly transporter: nodemailer.Transporter = nodemailer.createTransport({
    host: mailHost,
    port: mailPort,
    secure: isSecure,
    auth: {
      user: CONFIG.smtp.email,
      pass: CONFIG.smtp.password
    }
  })

  private constructor () { }

  static getInstance () {
    if (!MailSevice.instance) {
      MailSevice.instance = new MailSevice()
    }
    return MailSevice.instance
  }

  async sendMail (
    requestId: string | number | string[],
    options: MailInterface
  ) {
    CONSOL.info('sendMail from request -> ', requestId)
    await this.transporter.sendMail({
      from: `"${CONFIG.appName} team" <${options.from ?? CONFIG.smtp.sender}>`,
      to: options.to,
      cc: options.cc,
      bcc: options.bcc,
      subject: options.subject,
      text: options.text,
      html: options.html
    })
      .then((info: any) => {
        CONSOL.info('Message sent: %s', info.messageId)
        CONSOL.info(`${requestId} -> mail sent successfully`)
        CONSOL.info(`-> [Mail Response] = ${info.response} -> [Mail Message] = ${info.messageId}`)
        if (!isSecure) {
          CONSOL.info(`${requestId} - Nodemailer ethereal URL : ${nodemailer.getTestMessageUrl(info)}`)
        }
        return info
      })
  }

  async verifyConetion () {
    return await this.transporter.verify()
  }

  getTransporter () {
    return this.transporter
  }
}
