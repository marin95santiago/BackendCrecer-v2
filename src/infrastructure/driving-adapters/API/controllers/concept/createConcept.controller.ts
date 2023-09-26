import { NextFunction, Request, Response } from 'express'
import { DynamoDBConceptRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBConceptRepository'
import { ConceptCreatorUseCase } from '../../../../../application/useCases/ConceptCreator'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'

export const createConcept = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const {
    account,
    description,
    type
  } = req.body

  const { sessionUser } = req.params

  const dynamoDBConceptRepository = new DynamoDBConceptRepository()
  const conceptCreatorUseCase = new ConceptCreatorUseCase(dynamoDBConceptRepository)

  try {
    const session = JSON.parse(sessionUser)
    const doesSuperAdminHavePermission = true
    const havePermission = validatePermission(permissionsList.concept.create, session.data.user.permissions, doesSuperAdminHavePermission)

    if (!havePermission) throw new PermissionNotAvailableException()

    const conceptCreated = await conceptCreatorUseCase.run({
      entityId: session.data.user.entityId,
      account: account ? Number(account) : 0,
      description,
      type: {
        code: type.code,
        description: type.description
      }
    })

    res.json(conceptCreated)
  } catch (error) {
    return next(error)
  }
}
