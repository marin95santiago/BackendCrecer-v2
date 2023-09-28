import { NextFunction, Request, Response } from 'express'
import { DynamoDBConceptRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBConceptRepository'
import { ConceptGetterUseCase } from '../../../../../application/useCases/ConceptGetter'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'

export const getAllConcepts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { sessionUser } = req.params
  const { limit, lastEvaluatedKey } = req.query

  const params = {
    limit: limit !== undefined ? Number(limit) : undefined,
    lastEvaluatedKey: lastEvaluatedKey !== undefined ? JSON.parse(lastEvaluatedKey.toString()) : undefined
  }

  const dynamoDBConceptRepository = new DynamoDBConceptRepository()
  const conceptGetterUseCase = new ConceptGetterUseCase(dynamoDBConceptRepository)

  try {
    const session = JSON.parse(sessionUser)
    const doesSuperAdminHavePermission = true
    const havePermission = validatePermission(permissionsList.concept.view, session.data.user.permissions, doesSuperAdminHavePermission)

    if (!havePermission) throw new PermissionNotAvailableException()

    const response = await conceptGetterUseCase.run(session.data.user.entityId, params.limit, params.lastEvaluatedKey)
    res.json(response)
    return
  } catch (e) { 
    return next(e)
  }
}
