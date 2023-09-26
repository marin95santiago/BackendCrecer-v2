import { Concept } from 'domain/entities/Concept.entity'

export interface ConceptRepository {
  getAll: (entityId: string) => Promise<Concept[]>
  save: (concept: Concept) => Promise<Concept>
  getByAccount: (account: number, entityId: string) => Promise<Concept | null>
}
