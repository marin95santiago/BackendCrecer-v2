import { Third } from '../../../domain/entities/Third.entity'
import { ThirdRepository } from '../../../domain/repositories/Third.repository'

export class ThirdGetterByDocumentUseCase {
  private readonly _thirdRepository: ThirdRepository

  constructor (thirdRepository: ThirdRepository) {
    this._thirdRepository = thirdRepository
  }

  /**
   * Return third by document
   * @param document {string}
   * @returns {Third | null}
   */
  async run (document: string, entityId: string): Promise<Third | null> {
    const third = await this._thirdRepository.getByDocument(document, entityId)
    return third
  }
}
