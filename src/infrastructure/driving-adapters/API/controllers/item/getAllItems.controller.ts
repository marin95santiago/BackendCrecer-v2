import { NextFunction, Request, Response } from 'express'
import { DynamoDBItemRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBItemRepository'
import { ItemGetterUseCase } from '../../../../../application/useCases/ItemGetter'

export const getAllItems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const dynamoDBItemRepository = new DynamoDBItemRepository()
  const itemGetterUseCase = new ItemGetterUseCase(dynamoDBItemRepository)

  try {
    const items = await itemGetterUseCase.run()
    res.json(items)
    return
  } catch (e) {
    return next(e)
  }
}
