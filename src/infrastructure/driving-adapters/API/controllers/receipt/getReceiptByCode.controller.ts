import { NextFunction, Request, Response } from 'express'
import { DynamoDBReceiptRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBReceiptRepository'
import { ReceiptGetterByCodeUseCase } from '../../../../../application/useCases/ReceiptGetterByCode'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'

export const getReceiptByCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { sessionUser, code } = req.params

  const params = {
    code: code ? `${code}` : ''
  }

  const dynamoDBReceiptRepository = new DynamoDBReceiptRepository()
  const teceiptGetterByCodeUseCase = new ReceiptGetterByCodeUseCase(dynamoDBReceiptRepository)

  try {
    const session = JSON.parse(sessionUser)
    const doesSuperAdminHavePermission = true
    const havePermission = validatePermission(permissionsList.receipt.view, session.data.user.permissions, doesSuperAdminHavePermission)

    if (!havePermission) throw new PermissionNotAvailableException()

    const response = await teceiptGetterByCodeUseCase.run(params.code, session.data.user.entityId)
    res.json(response)
    return
  } catch (e) { 
    return next(e)
  }
}
