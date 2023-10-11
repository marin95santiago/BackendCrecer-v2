import { NextFunction, Request, Response } from 'express'
import { DynamoDBReceiptRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBReceiptRepository'
import { ReceiptGetterUseCase } from '../../../../../application/useCases/ReceiptGetter'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'

export const getAllReceipts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { sessionUser } = req.params
  const { limit, lastEvaluatedKey } = req.query

  const params = {
    limit: limit !== undefined ? Number(limit) : undefined,
    lastEvaluatedKey: lastEvaluatedKey !== undefined ? JSON.parse(lastEvaluatedKey.toString()) : undefined
  }

  const dynamoDBReceiptRepository = new DynamoDBReceiptRepository()
  const receiptGetterUseCase = new ReceiptGetterUseCase(dynamoDBReceiptRepository)

  try {
    const session = JSON.parse(sessionUser)
    const doesSuperAdminHavePermission = true
    const havePermission = validatePermission(permissionsList.receipt.view, session.data.user.permissions, doesSuperAdminHavePermission)

    if (!havePermission) throw new PermissionNotAvailableException()

    const response = await receiptGetterUseCase.run(session.data.user.entityId, params.limit, params.lastEvaluatedKey)
    res.json(response)
    return
  } catch (e) { 
    return next(e)
  }
}
