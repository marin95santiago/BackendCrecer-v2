import { Third } from '../../../domain/entities/Third.entity'
import { ThirdRepository } from '../../../domain/repositories/Third.repository'

export class ThirdGetterUseCase {
  private readonly _thirdRepository: ThirdRepository

  constructor (thirdRepository: ThirdRepository) {
    this._thirdRepository = thirdRepository
  }

  async run (entityId: string, limit?: number, lastEvaluatedKey?: any): Promise<{ lastEvaluatedKey: any, thirds: Third[] }> {
    const response: { lastEvaluatedKey: any, thirds: Third[] } = await this._thirdRepository.getAll(entityId, limit, lastEvaluatedKey)
    return response
  }
}
