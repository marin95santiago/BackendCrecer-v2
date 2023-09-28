import { Concept } from '../../../domain/entities/Concept.entity'
import { ConceptRepository } from '../../../domain/repositories/Concept.repository'

export class ConceptGetterUseCase {
  private readonly _conceptRepository: ConceptRepository

  constructor (conceptRepository: ConceptRepository) {
    this._conceptRepository = conceptRepository
  }

  async run (entityId: string, limit?: number, lastEvaluatedKey?: any): Promise<{ lastEvaluatedKey: any, concepts: Concept[] }> {
    const response: { lastEvaluatedKey: any, concepts: Concept[] } = await this._conceptRepository.getAll(entityId, limit, lastEvaluatedKey)
    return response
  }
}
