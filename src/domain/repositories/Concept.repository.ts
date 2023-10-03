import { Concept } from 'domain/entities/Concept.entity'

export interface ConceptRepository {
  getAll: (entityId: string, limit?: number, lastEvaluatedKey?: any) => Promise<{lastEvaluatedKey: any, concepts: Concept[]}>
  save: (concept: Concept) => Promise<Concept>
  getByAccount: (account: number, entityId: string) => Promise<Concept | null>
  update: (concept: Concept) => Promise<Concept>
}
