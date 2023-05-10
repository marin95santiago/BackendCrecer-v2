import { NextFunction, Request, Response } from 'express'
import { DynamoDBElectronicBillRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBElectronicBillRepository'
import { ElectronicBillGetterByNumberUseCase } from '../../../../../application/useCases/ElectronicBillGetterByNumber'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'

export const getElectronicBillByNumber = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { sessionUser, number } = req.params

  const params = {
    number: number ? Number(`${number}`) : 0
  }

  const dynamoDBElectronicBillRepository = new DynamoDBElectronicBillRepository()
  const electronicBillGetterByNumberUseCase = new ElectronicBillGetterByNumberUseCase(dynamoDBElectronicBillRepository)

  try {
    const session = JSON.parse(sessionUser)
    const doesSuperAdminHavePermission = true
    const havePermission = validatePermission(permissionsList.electronic_bill.view, session.data.user.permissions, doesSuperAdminHavePermission)

    if (!havePermission) throw new PermissionNotAvailableException()

    const response = await electronicBillGetterByNumberUseCase.run(session.data.user.entityId, params.number)
    res.json(response)
    return
  } catch (e) { 
    return next(e)
  }
}
