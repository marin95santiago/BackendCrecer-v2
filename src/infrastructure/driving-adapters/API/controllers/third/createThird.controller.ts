import { NextFunction, Request, Response } from 'express'
import { DynamoDBThirdRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBThirdRepository'
import { ThirdCreatorUseCase } from '../../../../../application/useCases/ThirdCreator'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'

export const createThird = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const {
    document,
    dv,
    documentType,
    organizationType,
    liabilityType,
    regimeType,
    businessName,
    name,
    lastname,
    phone,
    address,
    city,
    email
  } = req.body

  const { sessionUser } = req.params

  const dynamoDBThirdRepository = new DynamoDBThirdRepository()
  const thirdCreatorUseCase = new ThirdCreatorUseCase(dynamoDBThirdRepository)

  try {
    const session = JSON.parse(sessionUser)
    const doesSuperAdminHavePermission = true
    const havePermission = validatePermission(permissionsList.third.create, session.data.permissions, doesSuperAdminHavePermission)

    if (!havePermission) throw new PermissionNotAvailableException()

    const thirdCreated = await thirdCreatorUseCase.run({
      entityId: session.data.entityId,
      document,
      dv,
      documentType,
      organizationType,
      liabilityType,
      regimeType,
      businessName,
      name,
      lastname,
      phone,
      address,
      city,
      email
    })

    res.json(thirdCreated)
  } catch (error) {
    return next(error)
  }
}
