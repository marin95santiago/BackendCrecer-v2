import { NextFunction, Request, Response } from 'express'
import { DynamoDBUserRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBUserRepository'
import { UserUpdaterUseCase } from '../../../../../application/useCases/UserUpdater'

export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.params.userId
  const dynamoDBUserRepo = new DynamoDBUserRepository()
  const userUpdaterUseCase = new UserUpdaterUseCase(dynamoDBUserRepo)

  try {
    const userToUpdate = {
      ...req.body,
      id: userId
    }

    const userUpdated = await userUpdaterUseCase.run(userToUpdate)

    res.json(userUpdated)
    return
  } catch (e) {
    return next(e)
  }
}
