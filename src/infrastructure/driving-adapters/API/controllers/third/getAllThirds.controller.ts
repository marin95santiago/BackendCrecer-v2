import { NextFunction, Request, Response } from 'express'
import { DynamoDBThirdRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBThirdRepository'
import { ThirdGetterUseCase } from '../../../../../application/useCases/ThirdGetter'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'

export const getAllThirds = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { sessionUser } = req.params
  const dynamoDBThirdRepository = new DynamoDBThirdRepository()
  const thirdGetterUseCase = new ThirdGetterUseCase(dynamoDBThirdRepository)

  try {
    const session = JSON.parse(sessionUser)
    const doesSuperAdminHavePermission = true
    const havePermission = validatePermission(permissionsList.third.view, session.data.user.permissions, doesSuperAdminHavePermission)

    if (!havePermission) throw new PermissionNotAvailableException()
    const thirds = await thirdGetterUseCase.run(session.data.user.entityId)
    res.json(thirds)
    return
  } catch (e) { 
    return next(e)
  }
}
