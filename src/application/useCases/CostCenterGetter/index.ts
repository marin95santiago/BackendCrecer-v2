import { CostCenter } from '../../../domain/entities/CostCenter.entity'
import { CostCenterRepository } from '../../../domain/repositories/CostCenter.repository'

export class CostCenterGetterUseCase {
  private readonly _costCenterRepository: CostCenterRepository

  constructor (costCenterRepository: CostCenterRepository) {
    this._costCenterRepository = costCenterRepository
  }

  async run (entityId: string, limit?: number, lastEvaluatedKey?: any): Promise<{ lastEvaluatedKey: any, costCenters: CostCenter[] }> {
    const response: { lastEvaluatedKey: any, costCenters: CostCenter[] } = await this._costCenterRepository.getAll(entityId, limit, lastEvaluatedKey)
    return response
  }
}
