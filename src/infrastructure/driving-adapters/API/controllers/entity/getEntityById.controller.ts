import { NextFunction, Request, Response } from 'express'
import { EntityGetterByIdUseCase } from '../../../../../application/useCases/EntityGetterById'
import { DynamoDBEntityRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBEntityRepository'

export const getEntityById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const entityId = req.query.entityId || ''

  const dynamoDBEntityRepo = new DynamoDBEntityRepository()
  const entityGetterByIdUseCase = new EntityGetterByIdUseCase(dynamoDBEntityRepo)

  try {
    const entity = await entityGetterByIdUseCase.run(`${entityId}`)
    res.json(entity)
    return
  } catch (e) {
    return next(e)
  }
}
