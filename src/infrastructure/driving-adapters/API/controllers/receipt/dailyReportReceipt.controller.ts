import { NextFunction, Request, Response } from 'express'
import { DynamoDBReceiptRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBReceiptRepository'
import { DailyReportReceiptCreatorUseCase } from '../../../../../application/useCases/DailyReportCreatorUseCase'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'
import { DynamoDBAccountRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBAccountRepository'


export const dailyReportReceipt = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { sessionUser } = req.params
  const { date } = req.query

  const params = {
    date: `${date}`
  }

  const dynamoDBReceiptRepository = new DynamoDBReceiptRepository()
  const dynamoDBAccountRepository = new DynamoDBAccountRepository()
  const receiptGetterUseCase = new DailyReportReceiptCreatorUseCase(dynamoDBReceiptRepository, dynamoDBAccountRepository)

  try {
    const session = JSON.parse(sessionUser)
    const doesSuperAdminHavePermission = true
    const havePermission = validatePermission(permissionsList.report.daily_report_receipt, session.data.user.permissions, doesSuperAdminHavePermission)

    if (!havePermission) throw new PermissionNotAvailableException()

    const response = await receiptGetterUseCase.run(session.data.user.entityId, params.date)
    res.json(response)
    return
  } catch (e) { 
    return next(e)
  }
}
