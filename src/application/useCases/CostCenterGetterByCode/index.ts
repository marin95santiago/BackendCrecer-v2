import { CostCenter } from '../../../domain/entities/CostCenter.entity'
import { CostCenterRepository } from '../../../domain/repositories/CostCenter.repository'

export class CostCenterGetterByCodeUseCase {
  private readonly _costCenterRepository: CostCenterRepository

  constructor (costCenterRepository: CostCenterRepository) {
    this._costCenterRepository = costCenterRepository
  }

  /**
   * Return cost center by account
   * @param code {string}
   * @returns {CostCenter | null}
   */
  async run (code: string, entityId: string): Promise<CostCenter | null> {
    const costCenter = await this._costCenterRepository.getByCode(code, entityId)
    return costCenter
  }
}
