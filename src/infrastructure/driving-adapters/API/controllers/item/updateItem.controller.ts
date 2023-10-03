import { NextFunction, Request, Response } from 'express'
import { DynamoDBItemRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBItemRepository'
import { ItemUpdaterUseCase } from '../../../../../application/useCases/ItemUpdater'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'

export const updateItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  const { sessionUser } = req.params

  const dynamoDBItemRepository = new DynamoDBItemRepository()
  const itemUpdaterUseCase = new ItemUpdaterUseCase(dynamoDBItemRepository)

  try {
    const session = JSON.parse(sessionUser)
    const doesSuperAdminHavePermission = true
    const havePermission = validatePermission(permissionsList.item.update, session.data.user.permissions, doesSuperAdminHavePermission)
    
    if (!havePermission) throw new PermissionNotAvailableException()

    const itemUpdated = await itemUpdaterUseCase.run(req.body)

    res.json(itemUpdated)
    return
  } catch (e) {
    return next(e)
  }
}
