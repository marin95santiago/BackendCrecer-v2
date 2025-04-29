import { NextFunction, Request, Response } from 'express'
import { DynamoDBEntityRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBEntityRepository'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'
import { SupportDocumentGetterUseCase } from '../../../../../application/useCases/SupportDocumentGetter'

export const getSupportDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { sessionUser } = req.params

  const dynamoDBEntityRepository = new DynamoDBEntityRepository()
  const electronicBillGetterUseCase = new SupportDocumentGetterUseCase (dynamoDBEntityRepository)

  try {
    const session = JSON.parse(sessionUser)
    const doesSuperAdminHavePermission = true
    const havePermission = validatePermission(permissionsList.support_document.list, session.data.user.permissions, doesSuperAdminHavePermission)
    if (!havePermission) throw new PermissionNotAvailableException()

    const supportDocumentList = await electronicBillGetterUseCase.run(session.data.user.entityId)

    res.json(supportDocumentList)
  } catch (error) {
    return next(error)
  }
}
