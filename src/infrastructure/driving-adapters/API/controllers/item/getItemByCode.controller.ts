import { NextFunction, Request, Response } from 'express'
import { DynamoDBItemRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBItemRepository'
import { ItemGetterByCodeUseCase } from '../../../../../application/useCases/ItemGetterByCode'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'

export const getItemByCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { sessionUser, code } = req.params

  const params = {
    code: code ? `${code}` : ''
  }

  const dynamoDBItemRepository = new DynamoDBItemRepository()
  const itemGetterByCodeUseCase = new ItemGetterByCodeUseCase(dynamoDBItemRepository)

  try {
    const session = JSON.parse(sessionUser)
    const doesSuperAdminHavePermission = true
    const havePermission = validatePermission(permissionsList.item.view, session.data.user.permissions, doesSuperAdminHavePermission)

    if (!havePermission) throw new PermissionNotAvailableException()

    const response = await itemGetterByCodeUseCase.run(params.code, session.data.user.entityId)
    res.json(response)
    return
  } catch (e) { 
    return next(e)
  }
}
