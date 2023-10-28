import { CostCenter } from 'domain/entities/CostCenter.entity'

export interface CostCenterRepository {
  getAll: (entityId: string, limit?: number, lastEvaluatedKey?: any) => Promise<{lastEvaluatedKey: any, costCenters: CostCenter[]}>
  save: (costCenter: CostCenter) => Promise<CostCenter>
  getByCode: (code: string, entityId: string) => Promise<CostCenter | null>
  update: (costCenter: CostCenter) => Promise<CostCenter>
}
