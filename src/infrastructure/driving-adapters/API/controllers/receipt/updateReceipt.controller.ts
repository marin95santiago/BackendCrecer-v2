import { NextFunction, Request, Response } from 'express'
import { DynamoDBReceiptRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBReceiptRepository'
import { DynamoDBAccountRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBAccountRepository'
import { ReceiptUpdaterUseCase } from '../../../../../application/useCases/ReceiptUpdater'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'

export const updateReceipt = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  const { sessionUser } = req.params

  const dynamoDBReceiptRepo = new DynamoDBReceiptRepository()
  const dynamoDBAccountRepository = new DynamoDBAccountRepository()
  const receiptUpdaterUseCase = new ReceiptUpdaterUseCase(dynamoDBReceiptRepo, dynamoDBAccountRepository)

  try {
    const session = JSON.parse(sessionUser)
    const doesSuperAdminHavePermission = true
    const havePermission = validatePermission(permissionsList.receipt.update, session.data.user.permissions, doesSuperAdminHavePermission)
    
    if (!havePermission) throw new PermissionNotAvailableException()

    const receiptUpdated = await receiptUpdaterUseCase.run(req.body)

    res.json(receiptUpdated)
    return
  } catch (e) {
    return next(e)
  }
}
