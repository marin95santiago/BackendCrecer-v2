import { NextFunction, Request, Response } from 'express'
import { DynamoDBThirdRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBThirdRepository'
import { ThirdGetterUseCase } from '../../../../../application/useCases/ThirdGetter'

export const getAllThirds = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const dynamoDBThirdRepository = new DynamoDBThirdRepository()
  const thirdGetterUseCase = new ThirdGetterUseCase(dynamoDBThirdRepository)

  try {
    const thirds = await thirdGetterUseCase.run()
    res.json(thirds)
    return
  } catch (e) { 
    return next(e)
  }
}
