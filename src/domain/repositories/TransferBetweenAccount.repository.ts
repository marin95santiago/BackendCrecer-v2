import { TransferBetweenAccount } from 'domain/entities/TransferBetweenAccount.entity'

export interface TransferBetweenAccountRepository {
  getAll: (entityId: string, limit?: number, lastEvaluatedKey?: any) => Promise<{lastEvaluatedKey: any, transfers: TransferBetweenAccount[]}>
  save: (transfer: TransferBetweenAccount) => Promise<TransferBetweenAccount>
  getByDateForDailyReport: (entityId: string, date: string, limit?: number, lastEvaluatedKey?: any) => Promise<{lastEvaluatedKey: any, transfers: any[]}>
}
