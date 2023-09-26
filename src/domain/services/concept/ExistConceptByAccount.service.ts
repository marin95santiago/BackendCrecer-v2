import { ConceptRepository } from '../../repositories/Concept.repository'

export class ExistConceptByAccountService {
  private readonly _conceptRepository: ConceptRepository

  constructor (conceptRepository: ConceptRepository) {
    this._conceptRepository = conceptRepository
  }

  /**
   * Return true or false if concept already exist
   * @param account {number}
   * @returns {boolean} true or false
   */
  async run (account: number, entityId: string): Promise<boolean> {
    const item = await this._conceptRepository.getByAccount(account, entityId)

    // exist return true
    if (item !== null) return true

    return false
  }
}
