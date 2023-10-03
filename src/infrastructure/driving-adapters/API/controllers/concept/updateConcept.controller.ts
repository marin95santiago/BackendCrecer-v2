import { NextFunction, Request, Response } from 'express'
import { DynamoDBConceptRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBConceptRepository'
import { ConceptUpdaterUseCase } from '../../../../../application/useCases/ConceptUpdater'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'

export const updateConcept = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  const { sessionUser } = req.params

  const dynamoDBConceptRepository = new DynamoDBConceptRepository()
  const conceptUpdaterUseCase = new ConceptUpdaterUseCase(dynamoDBConceptRepository)

  try {
    const session = JSON.parse(sessionUser)
    const doesSuperAdminHavePermission = true
    const havePermission = validatePermission(permissionsList.concept.update, session.data.user.permissions, doesSuperAdminHavePermission)
    
    if (!havePermission) throw new PermissionNotAvailableException()

    const conceptUpdated = await conceptUpdaterUseCase.run(req.body)

    res.json(conceptUpdated)
    return
  } catch (e) {
    return next(e)
  }
}
