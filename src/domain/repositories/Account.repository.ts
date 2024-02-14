import { Account } from 'domain/entities/Account.entity'

export interface AccountRepository {
  getAll: (entityId: string, limit?: number, lastEvaluatedKey?: any) => Promise<{lastEvaluatedKey: any, accounts: Account[]}>
  save: (account: Account) => Promise<Account>
  getByAccount: (account: number, entityId: string) => Promise<Account | null>
  update: (account: Account) => Promise<Account>
}
