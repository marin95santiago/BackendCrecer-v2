import { NextFunction, Request, Response } from 'express'
import { DynamoDBAccountRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBAccountRepository'
import { DynamoDBTransferBetweenAccountRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBTransferBetweenAccountRepository'
import { TransferBetweenAccountUseCase } from '../../../../../application/useCases/TransferBetweenAccount'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'

export const transferBetweenAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const {
    date,
    code,
    total,
    sourceAccount,
    destinationAccount
  } = req.body

  const { sessionUser } = req.params

  const dynamoDBAccountRepository = new DynamoDBAccountRepository()
  const dynamoDBTransferBetweenAccountRepository = new DynamoDBTransferBetweenAccountRepository()
  const transferBetweenAccountUseCase = new TransferBetweenAccountUseCase(dynamoDBTransferBetweenAccountRepository, dynamoDBAccountRepository)

  try {
    const session = JSON.parse(sessionUser)
    const doesSuperAdminHavePermission = true
    const havePermission = validatePermission(permissionsList.account.transfer, session.data.user.permissions, doesSuperAdminHavePermission)

    if (!havePermission) throw new PermissionNotAvailableException()
  
    const transferCreated = await transferBetweenAccountUseCase.run({
      entityId: session.data.user.entityId,
      userId: session.data.user.id,
      date: date,
      code: code,
      total: total ? Number(total) : 0,
      sourceAccount: sourceAccount ? Number(sourceAccount) : 0,
      destinationAccount: destinationAccount ? Number(destinationAccount) : 0,
      status: 'VALID'
    })

    res.json(transferCreated)
  } catch (error) {
    return next(error)
  }
}
