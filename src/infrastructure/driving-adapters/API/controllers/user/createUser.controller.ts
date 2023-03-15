import { NextFunction, Request, Response } from 'express'
import { DynamoDBUserRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBUserRepository'
import { UserCreatorUseCase } from '../../../../../application/useCases/UserCreator'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'
import { v4 as uuidv4 } from 'uuid'

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const {
    email,
    password,
    name,
    lastname,
    entityId,
    permissions
  } = req.body

  // const { sessionUser } = req.params

  const dynamoDBUserRepo = new DynamoDBUserRepository()
  const userCreatorUseCase = new UserCreatorUseCase(dynamoDBUserRepo)

  try {
    /*
    const session = JSON.parse(sessionUser)
    const doesSuperAdminHavePermission = true
    const havePermission = validatePermission(permissionsList.user.user_create, session.data.permissions, doesSuperAdminHavePermission)

    if (!havePermission) throw new PermissionNotAvailableException()
    */
    const userCreated = await userCreatorUseCase.run({
      id: uuidv4(),
      state: 'ACTIVE',
      email,
      password,
      name,
      lastname,
      entityId,
      permissions
    })

    res.json(userCreated)
    return
  } catch (error) {
    return next(error)
  }
}
