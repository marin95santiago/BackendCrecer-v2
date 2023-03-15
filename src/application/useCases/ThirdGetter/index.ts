import { Third } from '../../../domain/entities/Third.entity'
import { ThirdRepository } from '../../../domain/repositories/Third.repository'

export class ThirdGetterUseCase {
  private readonly _thirdRepository: ThirdRepository

  constructor (thirdRepository: ThirdRepository) {
    this._thirdRepository = thirdRepository
  }

  async run (): Promise<Third[]> {
    const thirds: Third[] = await this._thirdRepository.getAll()
    return thirds
  }
}
