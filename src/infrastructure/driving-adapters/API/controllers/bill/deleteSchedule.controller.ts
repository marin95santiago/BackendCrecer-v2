import { NextFunction, Request, Response } from 'express'
import { DynamoDBScheduleRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBScheduleRepository'
import { ScheduleDeleterUseCase } from '../../../../../application/useCases/ScheduleDeleter'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'

export const deleteSchedule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { sessionUser, code } = req.params

  const dynamoDBScheduleRepository = new DynamoDBScheduleRepository()
  const scheduleDeleterUseCase = new ScheduleDeleterUseCase(dynamoDBScheduleRepository)

  try {
    const session = JSON.parse(sessionUser)
    const doesSuperAdminHavePermission = true
    const havePermission = validatePermission(permissionsList.electronic_bill.schedule_delete, session.data.user.permissions, doesSuperAdminHavePermission)

    if (!havePermission) throw new PermissionNotAvailableException()

    const response = await scheduleDeleterUseCase.run(session.data.user.entityId, code)
    res.json(response)
    return
  } catch (e) { 
    return next(e)
  }
}
