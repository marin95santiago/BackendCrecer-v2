import { NextFunction, Request, Response } from 'express'
import { DynamoDBCostCenterRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBCostCenterRepository'
import { CostCenterCreatorUseCase } from '../../../../../application/useCases/CostCenterCreator'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'

export const createCostCenter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const {
    code,
    description,
    type
  } = req.body

  const { sessionUser } = req.params

  const dynamoDBCostCenterRepository = new DynamoDBCostCenterRepository()
  const costCenterCreatorUseCase = new CostCenterCreatorUseCase(dynamoDBCostCenterRepository)

  try {
    const session = JSON.parse(sessionUser)
    const doesSuperAdminHavePermission = true
    const havePermission = validatePermission(permissionsList.cost_center.create, session.data.user.permissions, doesSuperAdminHavePermission)

    if (!havePermission) throw new PermissionNotAvailableException()

    const costCenterCreated = await costCenterCreatorUseCase.run({
      entityId: session.data.user.entityId,
      code,
      description,
      type: {
        code: type.code,
        description: type.description
      }
    })

    res.json(costCenterCreated)
  } catch (error) {
    return next(error)
  }
}
