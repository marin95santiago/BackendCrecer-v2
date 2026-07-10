import { NextFunction, Request, Response } from 'express'
import { DynamoDBEntityRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBEntityRepository'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'
import { ElectronicBillGetterFromPlemsiUseCase } from '../../../../../application/useCases/ElectronicBillGetterFromPlemsi'

export const getElectronicBillsFromPlemsi = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { sessionUser } = req.params
  const { limit } = req.query

  const dynamoDBEntityRepository = new DynamoDBEntityRepository()
  const electronicBillGetterFromPlemsiUseCase = new ElectronicBillGetterFromPlemsiUseCase(dynamoDBEntityRepository)

  try {
    const session = JSON.parse(sessionUser)
    const doesSuperAdminHavePermission = true
    const havePermission = validatePermission(permissionsList.electronic_bill.list, session.data.user.permissions, doesSuperAdminHavePermission)
    if (!havePermission) throw new PermissionNotAvailableException()

    const limitValue = Number(limit) || 200
    const electronicBillList = await electronicBillGetterFromPlemsiUseCase.run(session.data.user.entityId, limitValue)

    res.json(electronicBillList)
  } catch (error) {
    return next(error)
  }
}

