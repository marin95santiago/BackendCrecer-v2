import { NextFunction, Request, Response } from 'express'
import { DynamoDBCostCenterRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBCostCenterRepository'
import { CostCenterGetterUseCase } from '../../../../../application/useCases/CostCenterGetter'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'

export const getAllCostCenters = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { sessionUser } = req.params
  const { limit, lastEvaluatedKey } = req.query

  const params = {
    limit: limit !== undefined ? Number(limit) : undefined,
    lastEvaluatedKey: lastEvaluatedKey !== undefined ? JSON.parse(lastEvaluatedKey.toString()) : undefined
  }

  const dynamoDBCostCenterRepository = new DynamoDBCostCenterRepository()
  const costCenterGetterUseCase = new CostCenterGetterUseCase(dynamoDBCostCenterRepository)

  try {
    const session = JSON.parse(sessionUser)
    const doesSuperAdminHavePermission = true
    const havePermission = validatePermission(permissionsList.cost_center.list, session.data.user.permissions, doesSuperAdminHavePermission)

    if (!havePermission) throw new PermissionNotAvailableException()

    const response = await costCenterGetterUseCase.run(session.data.user.entityId, params.limit, params.lastEvaluatedKey)
    res.json(response)
    return
  } catch (e) { 
    return next(e)
  }
}
