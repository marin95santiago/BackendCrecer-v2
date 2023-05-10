import { NextFunction, Request, Response } from 'express'
import { DynamoDBThirdRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBThirdRepository'
import { ThirdUpdaterUseCase } from '../../../../../application/useCases/ThirdUpdater'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'

export const updateThird = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  const { sessionUser } = req.params

  const dynamoDBThirdRepo = new DynamoDBThirdRepository()
  const thirdUpdaterUseCase = new ThirdUpdaterUseCase(dynamoDBThirdRepo)

  try {
    const session = JSON.parse(sessionUser)
    const doesSuperAdminHavePermission = true
    const havePermission = validatePermission(permissionsList.third.update, session.data.user.permissions, doesSuperAdminHavePermission)
    
    if (!havePermission) throw new PermissionNotAvailableException()

    const thirdUpdated = await thirdUpdaterUseCase.run(req.body)

    res.json(thirdUpdated)
    return
  } catch (e) {
    return next(e)
  }
}
