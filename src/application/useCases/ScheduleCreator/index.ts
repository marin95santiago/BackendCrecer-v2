import { Schedule } from '../../../domain/entities/Schedule.entity'
import { ScheduleRepository } from '../../../domain/repositories/Schedule.repository'
import { MissingPropertyException } from '../../../domain/exceptions/common/MissingProperty.exception'

export class ScheduleCreatorUseCase {
  private readonly _scheduleRepository: ScheduleRepository

  constructor(scheduleRepository: ScheduleRepository) {
    this._scheduleRepository = scheduleRepository
  }

  async run (body: Schedule): Promise<Schedule> {
    if (body.name === undefined || body.name === '') throw new MissingPropertyException('name')
    if (body.startDate === undefined || body.startDate === '') throw new MissingPropertyException('startDate')
    if (body.intervalDays === undefined || body.intervalDays === '') throw new MissingPropertyException('intervalDays')
    if (body.idForm === undefined || body.idForm === '') throw new MissingPropertyException('idForm')

    await this._scheduleRepository.save(body)

    return body
  }
}
