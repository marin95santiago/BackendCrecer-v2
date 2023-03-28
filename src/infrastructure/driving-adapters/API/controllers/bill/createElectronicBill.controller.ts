import { NextFunction, Request, Response } from 'express'
import { DynamoDBElectronicBillRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBElectronicBillRepository'
import { DynamoDBEntityRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBEntityRepository'
import { ElectronicBillCreatorUseCase  } from '../../../../../application/useCases/ElectronicBillCreator'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'

const prefixPlemsi = process.env.PREFIX_PLEMSI ?? 'SETT'

export const createElectronicBill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const {
    date,
    orderReference,
    third,
    wayToPay,
    paymentMethod,
    paymentDueDate,
    municipality,
    note,
    items,
    taxes,
    total,
    totalTaxes,
    totalToPay,
  } = req.body

  const { sessionUser } = req.params

  const dynamoDBElectronicBillRepository = new DynamoDBElectronicBillRepository()
  const dynamoDBEntityRepository = new DynamoDBEntityRepository()
  const electronicBillCreatorUseCase = new ElectronicBillCreatorUseCase (dynamoDBElectronicBillRepository, dynamoDBEntityRepository)

  try {
    const session = JSON.parse(sessionUser)
    const doesSuperAdminHavePermission = true
    const havePermission = validatePermission(permissionsList.electronic_bill.create, session.data.user.permissions, doesSuperAdminHavePermission)
    if (!havePermission) throw new PermissionNotAvailableException()

    const billCreated = await electronicBillCreatorUseCase.run({
      entityId: session.data.user.entityId,
      userId: session.data.user.id,
      date,
      orderReference,
      third,
      wayToPay,
      paymentMethod,
      paymentDueDate,
      municipality,
      note,
      items,
      taxes,
      total,
      totalTaxes,
      totalToPay
    })

    res.json(billCreated)
  } catch (error) {
    return next(error)
  }
}
