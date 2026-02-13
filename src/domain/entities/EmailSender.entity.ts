export interface SendEmailParams {
  html: string
  subject: string
  to: string
  cc: string[]
}

export interface IEmailSender {
  send (params: SendEmailParams): Promise<void>
}
