import { Concept } from '../../../domain/entities/Concept.entity'
import { ConceptRepository } from '../../../domain/repositories/Concept.repository'

export class ConceptGetterByAccountUseCase {
  private readonly _conceptRepository: ConceptRepository

  constructor (conceptRepository: ConceptRepository) {
    this._conceptRepository = conceptRepository
  }

  /**
   * Return concept by account
   * @param account {number}
   * @returns {Concept | null}
   */
  async run (account: number, entityId: string): Promise<Concept | null> {
    const concept = await this._conceptRepository.getByAccount(account, entityId)
    return concept
  }
}
