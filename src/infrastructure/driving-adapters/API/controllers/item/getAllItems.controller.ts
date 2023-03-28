import { NextFunction, Request, Response } from 'express'
import { DynamoDBItemRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBItemRepository'
import { ItemGetterUseCase } from '../../../../../application/useCases/ItemGetter'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'

export const getAllItems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { sessionUser } = req.params
  const dynamoDBItemRepository = new DynamoDBItemRepository()
  const itemGetterUseCase = new ItemGetterUseCase(dynamoDBItemRepository)

  try {
    const session = JSON.parse(sessionUser)
    const doesSuperAdminHavePermission = true
    const havePermission = validatePermission(permissionsList.item.view, session.data.user.permissions, doesSuperAdminHavePermission)
    if (!havePermission) throw new PermissionNotAvailableException()

    const items = await itemGetterUseCase.run(session.data.user.entityId)
    res.json(items)
    return
  } catch (e) {
    return next(e)
  }
}
