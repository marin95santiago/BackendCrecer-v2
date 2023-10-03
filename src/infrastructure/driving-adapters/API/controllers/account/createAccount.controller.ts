import { NextFunction, Request, Response } from 'express'
import { DynamoDBAccountRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBAccountRepository'
import { AccountCreatorUseCase } from '../../../../../application/useCases/AccountCreator'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'

export const createAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const {
    account,
    description,
    balance
  } = req.body

  const { sessionUser } = req.params

  const dynamoDBAccountRepository = new DynamoDBAccountRepository()
  const accountCreatorUseCase = new AccountCreatorUseCase(dynamoDBAccountRepository)

  try {
    const session = JSON.parse(sessionUser)
    const doesSuperAdminHavePermission = true
    const havePermission = validatePermission(permissionsList.account.create, session.data.user.permissions, doesSuperAdminHavePermission)

    if (!havePermission) throw new PermissionNotAvailableException()

    const accountCreated = await accountCreatorUseCase.run({
      entityId: session.data.user.entityId,
      account: account ? Number(account) : 0,
      description,
      balance: balance ? Number(balance) : 0
    })

    res.json(accountCreated)
  } catch (error) {
    return next(error)
  }
}
