import { NextFunction, Request, Response } from 'express'
import { DynamoDBAccountRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBAccountRepository'
import { AccountGetterByAccountUseCase } from '../../../../../application/useCases/AccountGetterByAccount'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'

export const getAccountByAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { sessionUser, account } = req.params

  const params = {
    account: account ? `${account}` : ''
  }

  const dynamoDBAccountRepository = new DynamoDBAccountRepository()
  const accountGetterByAccountUseCase = new AccountGetterByAccountUseCase(dynamoDBAccountRepository)

  try {
    const session = JSON.parse(sessionUser)
    const doesSuperAdminHavePermission = true
    const havePermission = validatePermission(permissionsList.account.view, session.data.user.permissions, doesSuperAdminHavePermission)

    if (!havePermission) throw new PermissionNotAvailableException()

    const response = await accountGetterByAccountUseCase.run(Number(params.account), session.data.user.entityId)
    res.json(response)
    return
  } catch (e) { 
    return next(e)
  }
}
