import { NextFunction, Request, Response } from 'express'
import { DynamoDBUserRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBUserRepository'
import { DynamoDBEntityRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBEntityRepository'
import { DynamoDBAuthTokenRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBAuthTokenRepository'
import { VerifyControlCodeUseCase } from '../../../../../application/useCases/VerifyControlCode'

const SECRET = process.env.SECRET ?? ''

export const verifyControlCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, code } = req.body
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ?? req.socket?.remoteAddress ?? '0.0.0.0'

  const userRepo = new DynamoDBUserRepository()
  const entityRepo = new DynamoDBEntityRepository()
  const authTokenRepo = new DynamoDBAuthTokenRepository()
  const useCase = new VerifyControlCodeUseCase(userRepo, entityRepo, authTokenRepo, SECRET)

  try {
    const result = await useCase.run(email, code, clientIp)
    res.json(result)
  } catch (error) {
    return next(error)
  }
}
