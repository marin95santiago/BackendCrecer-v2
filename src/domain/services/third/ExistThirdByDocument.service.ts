import { ThirdRepository } from '../../repositories/Third.repository'

export class ExistThirdByDocumentService {
  private readonly _thirdRepository: ThirdRepository

  constructor (thirdRepository: ThirdRepository) {
    this._thirdRepository = thirdRepository
  }

  /**
   * Return true or false if third already exist
   * @param document {string}
   * @returns {boolean} true or false
   */
  async run (document: string, entityId: string): Promise<boolean> {
    const third = await this._thirdRepository.getByDocument(document, entityId)

    // exist return true
    if (third !== null) return true

    return false
  }
}
