import { NextFunction, Request, Response } from 'express'
import { DynamoDBAccountRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBAccountRepository'
import { AccountUpdaterUseCase } from '../../../../../application/useCases/AccountUpdater'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'

export const updateAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  const { sessionUser } = req.params

  const dynamoDBAccountRepository = new DynamoDBAccountRepository()
  const accountUpdaterUseCase = new AccountUpdaterUseCase(dynamoDBAccountRepository)

  try {
    const session = JSON.parse(sessionUser)
    const doesSuperAdminHavePermission = true
    const havePermission = validatePermission(permissionsList.account.update, session.data.user.permissions, doesSuperAdminHavePermission)
    
    if (!havePermission) throw new PermissionNotAvailableException()

    const accountUpdated = await accountUpdaterUseCase.run(req.body)

    res.json(accountUpdated)
    return
  } catch (e) {
    return next(e)
  }
}
