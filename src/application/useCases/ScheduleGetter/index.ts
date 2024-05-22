import { Schedule } from '../../../domain/entities/Schedule.entity'
import { ScheduleRepository } from '../../../domain/repositories/Schedule.repository'

export class ScheduleGetterUseCase {
  private readonly _scheduleRepository: ScheduleRepository

  constructor (scheduleRepository: ScheduleRepository) {
    this._scheduleRepository = scheduleRepository
  }

  async run (entityId: string, entity: string, limit?: number, lastEvaluatedKey?: any): Promise<{ lastEvaluatedKey: any, schedules: Schedule[] }> {
    const response: { lastEvaluatedKey: any, schedules: Schedule[] } = await this._scheduleRepository.getByEntity(entityId, entity, limit, lastEvaluatedKey)
    return response
  }
}
