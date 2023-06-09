import { NextFunction, Request, Response } from 'express'
import { DynamoDBUserRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBUserRepository'
import { DynamoDBEntityRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBEntityRepository'
import { LoginUseCase } from '../../../../../application/useCases/Login'

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body
  const secret = process.env.SECRET ?? ''
  const dynamoDBUserRepo = new DynamoDBUserRepository()
  const dynamoDBEntityRepository = new DynamoDBEntityRepository()
  const loginUseCase = new LoginUseCase(dynamoDBUserRepo, dynamoDBEntityRepository)

  try {
    const result = await loginUseCase.run(email, password, secret)
    res.json(result)
  } catch (error) {
    return next(error)
  }
}
