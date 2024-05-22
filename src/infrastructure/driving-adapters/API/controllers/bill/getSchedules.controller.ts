import { NextFunction, Request, Response } from 'express'
import { DynamoDBScheduleRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBScheduleRepository'
import { ScheduleGetterUseCase } from '../../../../../application/useCases/ScheduleGetter'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'

export const getSchedules = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { sessionUser } = req.params
  const { limit, lastEvaluatedKey } = req.query

  const params = {
    limit: limit !== undefined ? Number(limit) : undefined,
    lastEvaluatedKey: lastEvaluatedKey !== undefined ? JSON.parse(lastEvaluatedKey.toString()) : undefined
  }

  const dynamoDBScheduleRepository = new DynamoDBScheduleRepository()
  const scheduleGetterUseCase = new ScheduleGetterUseCase(dynamoDBScheduleRepository)

  try {
    const session = JSON.parse(sessionUser)
    const doesSuperAdminHavePermission = true
    const havePermission = validatePermission(permissionsList.electronic_bill.schedule_view, session.data.user.permissions, doesSuperAdminHavePermission)

    if (!havePermission) throw new PermissionNotAvailableException()

    const response = await scheduleGetterUseCase.run(session.data.user.entityId, 'ElectronicBill', params.limit, params.lastEvaluatedKey)
    res.json(response)
    return
  } catch (e) { 
    return next(e)
  }
}
