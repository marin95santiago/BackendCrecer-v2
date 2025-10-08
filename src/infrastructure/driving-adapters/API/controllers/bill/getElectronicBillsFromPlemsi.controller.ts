import { NextFunction, Request, Response } from 'express'
import { DynamoDBEntityRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBEntityRepository'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'
import { ElectronicBillGetterFromPlemsiUseCase } from '../../../../../application/useCases/ElectronicBillGetterFromPlemsi'

export const getElectronicBillsFromPlemsi = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { sessionUser } = req.params
  const { page } = req.query

  const dynamoDBEntityRepository = new DynamoDBEntityRepository()
  const electronicBillGetterFromPlemsiUseCase = new ElectronicBillGetterFromPlemsiUseCase(dynamoDBEntityRepository)

  try {
    const session = JSON.parse(sessionUser)
    const doesSuperAdminHavePermission = true
    const havePermission = validatePermission(permissionsList.electronic_bill.list, session.data.user.permissions, doesSuperAdminHavePermission)
    if (!havePermission) throw new PermissionNotAvailableException()

    const electronicBillList = await electronicBillGetterFromPlemsiUseCase.run(session.data.user.entityId, Number(page))

    res.json(electronicBillList)
  } catch (error) {
    return next(error)
  }
}

