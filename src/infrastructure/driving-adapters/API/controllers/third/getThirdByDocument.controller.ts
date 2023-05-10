import { NextFunction, Request, Response } from 'express'
import { DynamoDBThirdRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBThirdRepository'
import { ThirdGetterByDocumentUseCase } from '../../../../../application/useCases/ThirdGetterByDocument'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'

export const getThirdByDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { sessionUser, document } = req.params

  const params = {
    document: document ? `${document}` : ''
  }

  const dynamoDBThirdRepository = new DynamoDBThirdRepository()
  const thirdGetterByDocumentUseCase = new ThirdGetterByDocumentUseCase(dynamoDBThirdRepository)

  try {
    const session = JSON.parse(sessionUser)
    const doesSuperAdminHavePermission = true
    const havePermission = validatePermission(permissionsList.third.view, session.data.user.permissions, doesSuperAdminHavePermission)

    if (!havePermission) throw new PermissionNotAvailableException()

    const response = await thirdGetterByDocumentUseCase.run(params.document, session.data.user.entityId)
    res.json(response)
    return
  } catch (e) { 
    return next(e)
  }
}
