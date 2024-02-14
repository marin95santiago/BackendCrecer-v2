import { CostCenterRepository } from '../../repositories/CostCenter.repository'

export class ExistCostCenterByCodeService {
  private readonly _costCenterRepository: CostCenterRepository

  constructor (costCenterRepository: CostCenterRepository) {
    this._costCenterRepository = costCenterRepository
  }

  /**
   * Return true or false if costCenter already exist
   * @param account {string}
   * @returns {boolean} true or false
   */
  async run (code: string, entityId: string): Promise<boolean> {
    const item = await this._costCenterRepository.getByCode(code, entityId)

    // exist return true
    if (item !== null) return true

    return false
  }
}
