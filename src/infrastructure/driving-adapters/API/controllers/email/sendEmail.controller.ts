import { NextFunction, Request, Response } from 'express'
import { NodemailerEmailSender } from '../../../../../domain/services/email/NodemailerEmailSender'
import { SendEmailUseCase } from '../../../../../application/useCases/SendEmail'
export const sendEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { html, subject, to, cc } = req.body

  const emailSender = new NodemailerEmailSender()
  const sendEmailUseCase = new SendEmailUseCase(emailSender)

  try {
    const result = await sendEmailUseCase.run(html, subject, to, cc ?? [])
    res.json(result)
  } catch (error) {
    return next(error)
  }
}
