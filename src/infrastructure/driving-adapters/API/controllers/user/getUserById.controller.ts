import { NextFunction, Request, Response } from 'express'
import { UserGetterByIdUseCase } from '../../../../../application/useCases/UserGetterById'
import { DynamoDBUserRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBUserRepository'

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.params.id

  const dynamoDBUserRepo = new DynamoDBUserRepository()
  const userGetterByIdUseCase = new UserGetterByIdUseCase(dynamoDBUserRepo)

  try {
    const user = await userGetterByIdUseCase.run(userId)
    res.json(user)
    return
  } catch (e) {
    return next(e)
  }
}
