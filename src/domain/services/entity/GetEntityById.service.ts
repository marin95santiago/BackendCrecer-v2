import { EntityRepository } from '../../repositories/Entity.repository'
import { Entity } from '../../entities/Entity.entity'

export class GetEntityByIdService {
  private readonly _entityRepository: EntityRepository

  constructor (entityRepository: EntityRepository) {
    this._entityRepository = entityRepository
  }

  /**
   * Return entity
   * @param entityId {string}
   * @returns {boolean} true or false
   */
  async run (entityId: string): Promise<Entity | null> {
    const entity = await this._entityRepository.getById(entityId)
    return entity
  }
}
