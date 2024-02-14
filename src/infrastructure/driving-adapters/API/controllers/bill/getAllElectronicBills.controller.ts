import { NextFunction, Request, Response } from 'express'
import { DynamoDBElectronicBillRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBElectronicBillRepository'
import { ElectronicBillGetterUseCase } from '../../../../../application/useCases/ElectronicBillGetter'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'

export const getAllElectronicBills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { sessionUser } = req.params
  const { limit, lastEvaluatedKey } = req.query

  const params = {
    limit: limit !== undefined ? Number(limit) : undefined,
    lastEvaluatedKey: lastEvaluatedKey !== undefined ? JSON.parse(lastEvaluatedKey.toString()) : undefined
  }

  const dynamoDBElectronicBillRepository = new DynamoDBElectronicBillRepository()
  const electronicBillGetterUseCase = new ElectronicBillGetterUseCase(dynamoDBElectronicBillRepository)

  try {
    const session = JSON.parse(sessionUser)
    const doesSuperAdminHavePermission = true
    const havePermission = validatePermission(permissionsList.electronic_bill.list, session.data.user.permissions, doesSuperAdminHavePermission)

    if (!havePermission) throw new PermissionNotAvailableException()

    const response = await electronicBillGetterUseCase.run(session.data.user.entityId, params.limit, params.lastEvaluatedKey)
    res.json(response)
    return
  } catch (e) { 
    return next(e)
  }
}
