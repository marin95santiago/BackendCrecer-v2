import { Entity } from 'domain/entities/Entity.entity'

export interface EntityRepository {
  save: (user: Entity) => Promise<Entity>
  getById: (id: string) => Promise<Entity | null>
  getByDocument: (document: string) => Promise<Entity | null>
}
