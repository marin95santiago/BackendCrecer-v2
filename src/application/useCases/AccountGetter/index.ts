import { Account } from '../../../domain/entities/Account.entity'
import { AccountRepository } from '../../../domain/repositories/Account.repository'

export class AccountGetterUseCase {
  private readonly _accountRepository: AccountRepository

  constructor (accountRepository: AccountRepository) {
    this._accountRepository = accountRepository
  }

  async run (entityId: string, limit?: number, lastEvaluatedKey?: any): Promise<{ lastEvaluatedKey: any, accounts: Account[] }> {
    const response: { lastEvaluatedKey: any, accounts: Account[] } = await this._accountRepository.getAll(entityId, limit, lastEvaluatedKey)
    return response
  }
}
