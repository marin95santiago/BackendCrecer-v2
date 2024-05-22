import { ScheduleRepository } from '../../../domain/repositories/Schedule.repository'

export class ScheduleDeleterUseCase {
  private readonly _scheduleRepository: ScheduleRepository

  constructor(scheduleRepository: ScheduleRepository) {
    this._scheduleRepository = scheduleRepository
  }

  async run (entityId: string, code: string): Promise<{ message: string }> {
    const response = await this._scheduleRepository.delete(entityId, code)

    return response
  }
}
