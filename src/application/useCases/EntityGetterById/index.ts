import { Entity } from '../../../domain/entities/Entity.entity'
import { EntityRepository } from '../../../domain/repositories/Entity.repository'

export class EntityGetterByIdUseCase {
  private readonly _entityRepository: EntityRepository

  constructor (entityRepository: EntityRepository) {
    this._entityRepository = entityRepository
  }

  async run (id: string): Promise<Entity | null> {
    const entityRes = await this._entityRepository.getById(id)
    return entityRes
  }
}
