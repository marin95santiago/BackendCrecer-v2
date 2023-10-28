import { NextFunction, Request, Response } from 'express'
import { DynamoDBCostCenterRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBCostCenterRepository'
import { CostCenterGetterByCodeUseCase } from '../../../../../application/useCases/CostCenterGetterByCode'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'

export const getCostCenterByCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { sessionUser, code } = req.params

  const dynamoDBCostCenterRepository = new DynamoDBCostCenterRepository()
  const costCenterGetterByCodeUseCase = new CostCenterGetterByCodeUseCase(dynamoDBCostCenterRepository)

  try {
    const session = JSON.parse(sessionUser)
    const doesSuperAdminHavePermission = true
    const havePermission = validatePermission(permissionsList.cost_center.view, session.data.user.permissions, doesSuperAdminHavePermission)

    if (!havePermission) throw new PermissionNotAvailableException()

    const response = await costCenterGetterByCodeUseCase.run(code, session.data.user.entityId)
    res.json(response)
    return
  } catch (e) { 
    return next(e)
  }
}
