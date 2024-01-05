import { NextFunction, Request, Response } from 'express'
import { DynamoDBReceiptRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBReceiptRepository'
import { DynamoDBAccountRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBAccountRepository'
import { CancelReceiptUseCase } from '../../../../../application/useCases/CancelReceipt'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'

export const cancelReceipt = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  const { sessionUser } = req.params
  const { code } = req.query

  const params = {
    code: `${code}`
  }

  const dynamoDBReceiptRepository = new DynamoDBReceiptRepository()
  const dynamoDBAccountRepository = new DynamoDBAccountRepository()
  const cancelReceipt = new CancelReceiptUseCase(dynamoDBReceiptRepository, dynamoDBAccountRepository)

  try {
    const session = JSON.parse(sessionUser)
    const doesSuperAdminHavePermission = true
    const havePermission = validatePermission(permissionsList.item.update, session.data.user.permissions, doesSuperAdminHavePermission)
    
    if (!havePermission) throw new PermissionNotAvailableException()

    const receiptCanceled = await cancelReceipt.run(session.data.user.entityId, params.code)

    res.json(receiptCanceled)
    return
  } catch (e) {
    return next(e)
  }
}
