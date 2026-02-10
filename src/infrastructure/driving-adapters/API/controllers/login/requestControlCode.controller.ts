import { NextFunction, Request, Response } from 'express'
import { DynamoDBUserRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBUserRepository'
import { DynamoDBAuthTokenRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBAuthTokenRepository'
import { NodemailerEmailSender } from '../../../../../domain/services/email/NodemailerEmailSender'
import { RequestControlCodeUseCase } from '../../../../../application/useCases/RequestControlCode'

const CONTROL_USER_DOMAIN = process.env.CONTROL_USER_DOMAIN ?? ''
const MASTER_EMAIL = process.env.MASTER_EMAIL ?? ''

export const requestControlCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email } = req.body
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ?? req.socket?.remoteAddress ?? '0.0.0.0'

  const userRepo = new DynamoDBUserRepository()
  const authTokenRepo = new DynamoDBAuthTokenRepository()
  const emailSender = new NodemailerEmailSender()
  const useCase = new RequestControlCodeUseCase(userRepo, authTokenRepo, emailSender, CONTROL_USER_DOMAIN, MASTER_EMAIL)

  try {
    const result = await useCase.run(email, clientIp)
    res.json(result)
  } catch (error) {
    return next(error)
  }
}
