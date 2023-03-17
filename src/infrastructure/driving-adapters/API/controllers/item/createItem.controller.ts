import { NextFunction, Request, Response } from 'express'
import { DynamoDBItemRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBItemRepository'
import { ItemCreatorUseCase } from '../../../../../application/useCases/ItemCreator'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'

export const createItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const {
    code,
    description,
    unitMeasure,
    price
  } = req.body

  const { sessionUser } = req.params

  const dynamoDBItemRepository = new DynamoDBItemRepository()
  const itemCreatorUseCase = new ItemCreatorUseCase(dynamoDBItemRepository)

  try {
    const session = JSON.parse(sessionUser)
    const doesSuperAdminHavePermission = true
    const havePermission = validatePermission(permissionsList.item.create, session.data.permissions, doesSuperAdminHavePermission)

    if (!havePermission) throw new PermissionNotAvailableException()

    const itemCreated = await itemCreatorUseCase.run({
      entityId: session.data.entityId,
      code,
      description,
      unitMeasure:{
        code: Number(unitMeasure.code),
        description: unitMeasure.description
      },
      price
    })

    res.json(itemCreated)
  } catch (error) {
    return next(error)
  }
}
