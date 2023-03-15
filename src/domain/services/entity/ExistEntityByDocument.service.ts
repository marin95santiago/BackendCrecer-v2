import { EntityRepository } from '../../repositories/Entity.repository'

export class ExistEntityByDocumentService {
  private readonly _entityRepository: EntityRepository

  constructor (entityRepository: EntityRepository) {
    this._entityRepository = entityRepository
  }

  /**
   * Return true or false if email already exist
   * @param document {string}
   * @returns {boolean} true or false
   */
  async run (document: string): Promise<boolean> {
    const entity = await this._entityRepository.getByDocument(document)

    // exist return true
    if (entity !== null) return true

    return false
  }
}
