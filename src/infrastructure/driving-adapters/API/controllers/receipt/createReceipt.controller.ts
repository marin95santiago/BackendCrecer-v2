import { NextFunction, Request, Response } from 'express'
import { DynamoDBReceiptRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBReceiptRepository'
import { DynamoDBEntityRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBEntityRepository'
import { DynamoDBAccountRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBAccountRepository'
import { ReceiptCreatorUseCase  } from '../../../../../application/useCases/ReceiptCreator'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'

export const createReceipt = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const {
    code,
    description,
    type,
    date,
    thirdDocument,
    totalValueLetter,
    total,
    accounts,
    concepts
  } = req.body

  const { sessionUser } = req.params

  const dynamoDBReceiptRepository = new DynamoDBReceiptRepository()
  const dynamoDBEntityRepository = new DynamoDBEntityRepository()
  const dynamoDBAccountRepository = new DynamoDBAccountRepository()
  const receiptCreatorUseCase = new ReceiptCreatorUseCase (dynamoDBReceiptRepository, dynamoDBEntityRepository, dynamoDBAccountRepository)

  try {
    const session = JSON.parse(sessionUser)
    const doesSuperAdminHavePermission = true
    const havePermission = validatePermission(permissionsList.receipt.create, session.data.user.permissions, doesSuperAdminHavePermission)
    if (!havePermission) throw new PermissionNotAvailableException()
    const receiptCreated = await receiptCreatorUseCase.run({
      entityId: session.data.user.entityId,
      userId: session.data.user.id,
      code,
      description,
      type: {
        code: type.code ?? '',
        description: type.description ?? ''
      },
      date,
      thirdDocument,
      totalValueLetter,
      total: Number(total),
      accounts: accounts.map((acc: any) => {
        return {
          account: Number(acc.account),
          value: Number(acc.value),
          costCenterCode: acc.costCenterCode
        }
      }),
      concepts: concepts.map((concept: any) => {
        return {
          account: Number(concept.account),
          value: Number(concept.value),
          description: concept.description,
          costCenterCode: concept.costCenterCode
        }
      })
    })

    res.json(receiptCreated)
  } catch (error) {
    return next(error)
  }
}
