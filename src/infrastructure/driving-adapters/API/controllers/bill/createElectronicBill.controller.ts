import { NextFunction, Request, Response } from 'express'
import { DynamoDBElectronicBillRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBElectronicBillRepository'
import { ElectronicBillCreatorUseCase  } from '../../../../../application/useCases/ElectronicBillCreator'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'

const prefixPlemsi = process.env.PREFIX_PLEMSI ?? 'SETT'

export const createElectronicBill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const {
    date,
    orderReference,
    customer,
    payment,
    items,
    head_note,
    foot_note,
    notes,
    invoiceBaseTotal,
    invoiceTaxExclusiveTotal,
    invoiceTaxInclusiveTotal,
    allTaxTotals,
    totalToPay,
    finalTotalToPay
  } = req.body

  const { sessionUser } = req.params

  const dynamoDBElectronicBillRepository = new DynamoDBElectronicBillRepository()
  const electronicBillCreatorUseCase = new ElectronicBillCreatorUseCase (dynamoDBElectronicBillRepository)

  try {
    const session = JSON.parse(sessionUser)
    const doesSuperAdminHavePermission = true
    const havePermission = validatePermission(permissionsList.electronic_bill.create, session.data.permissions, doesSuperAdminHavePermission)
    if (!havePermission) throw new PermissionNotAvailableException()

    const billCreated = await electronicBillCreatorUseCase.run({
      entityId: session.entityId,
      userId: session.id,
      plemsiApiKey: session.plemsiApiKey,
      date,
      time: '00:00:00',
      prefix: prefixPlemsi,
      number: 1,
      orderReference,
      send_email: true,
      customer,
      payment,
      items,
      resolution: '',
      resolutionText: '',
      head_note,
      foot_note,
      notes,
      invoiceBaseTotal,
      invoiceTaxExclusiveTotal,
      invoiceTaxInclusiveTotal,
      allTaxTotals,
      totalToPay,
      finalTotalToPay
    })

    res.json(billCreated)
  } catch (error) {
    return next(error)
  }
}
