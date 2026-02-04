import path from 'path'
import * as dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import type { IEmailSender, SendEmailParams } from '../../entities/EmailSender.entity'

dotenv.config({
  path: path.resolve(__dirname, '../../../../.env')
})

const SMTP_HOST = process.env.SMTP_HOST ?? 'smtp.office365.com'
const SMTP_PORT = Number(process.env.SMTP_PORT ?? '587')
const SMTP_USER = process.env.SMTP_USER ?? ''
const SMTP_PASS = process.env.SMTP_PASS ?? ''
const SMTP_FROM_NAME = process.env.SMTP_FROM_NAME ?? 'Sistema Crecer'

export class NodemailerEmailSender implements IEmailSender {
  private readonly _transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false,
    auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    requireTLS: true,
    tls: {
      ciphers: 'SSLv3'
    }
  })

  async send (params: SendEmailParams): Promise<void> {
    const { html, subject, to, cc } = params
    await this._transporter.sendMail({
      from: SMTP_FROM_NAME ? `"${SMTP_FROM_NAME}" <${SMTP_USER}>` : SMTP_USER,
      to,
      cc: cc.length > 0 ? cc : undefined,
      subject,
      html
    })
  }
}
