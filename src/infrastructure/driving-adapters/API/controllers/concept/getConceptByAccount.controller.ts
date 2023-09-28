import { NextFunction, Request, Response } from 'express'
import { DynamoDBConceptRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBConceptRepository'
import { ConceptGetterByAccountUseCase } from '../../../../../application/useCases/ConceptGetterByAccount'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'

export const getConceptByAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { sessionUser, account } = req.params

  const params = {
    account: account ? `${account}` : ''
  }

  const dynamoDBConceptRepository = new DynamoDBConceptRepository()
  const conceptGetterByAccountUseCase = new ConceptGetterByAccountUseCase(dynamoDBConceptRepository)

  try {
    const session = JSON.parse(sessionUser)
    const doesSuperAdminHavePermission = true
    const havePermission = validatePermission(permissionsList.concept.view, session.data.user.permissions, doesSuperAdminHavePermission)

    if (!havePermission) throw new PermissionNotAvailableException()

    const response = await conceptGetterByAccountUseCase.run(Number(params.account), session.data.user.entityId)
    res.json(response)
    return
  } catch (e) { 
    return next(e)
  }
}
