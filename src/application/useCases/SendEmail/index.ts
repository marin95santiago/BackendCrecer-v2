import type { IEmailSender } from '../../../domain/entities/EmailSender.entity'
import { MissingPropertyException } from '../../../domain/exceptions/common/MissingProperty.exception'
import { UnhandledException } from '../../../domain/exceptions/common/Unhandled.exception'

export class SendEmailUseCase {
  constructor (private readonly _emailSender: IEmailSender) {}

  async run (html: string, subject: string, to: string, cc: string[]): Promise<{ sent: true }> {
    if (!html?.trim()) throw new MissingPropertyException('html')
    if (!subject?.trim()) throw new MissingPropertyException('subject')
    if (!to?.trim()) throw new MissingPropertyException('to')

    const normalizedCc = Array.isArray(cc) ? cc.filter(e => typeof e === 'string' && e.trim()) : []

    try {
      await this._emailSender.send({
        html: html.trim(),
        subject: subject.trim(),
        to: to.trim(),
        cc: normalizedCc
      })
      return { sent: true }
    } catch (error) {
      throw new UnhandledException(
        error instanceof Error ? error.message : 'Error al enviar el correo'
      )
    }
  }
}
