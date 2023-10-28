import { NextFunction, Request, Response } from 'express'
import { DynamoDBCostCenterRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBCostCenterRepository'
import { CostCenterUpdaterUseCase } from '../../../../../application/useCases/CostCenterUpdater'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'

export const updateCostCenter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  const { sessionUser } = req.params

  const dynamoDBCostCenterRepository = new DynamoDBCostCenterRepository()
  const costCenterUpdaterUseCase = new CostCenterUpdaterUseCase(dynamoDBCostCenterRepository)

  try {
    const session = JSON.parse(sessionUser)
    const doesSuperAdminHavePermission = true
    const havePermission = validatePermission(permissionsList.cost_center.update, session.data.user.permissions, doesSuperAdminHavePermission)
    
    if (!havePermission) throw new PermissionNotAvailableException()

    const costCenterUpdated = await costCenterUpdaterUseCase.run(req.body)

    res.json(costCenterUpdated)
    return
  } catch (e) {
    return next(e)
  }
}
