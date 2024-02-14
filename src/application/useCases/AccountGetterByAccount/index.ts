import { Account } from '../../../domain/entities/Account.entity'
import { AccountRepository } from '../../../domain/repositories/Account.repository'

export class AccountGetterByAccountUseCase {
  private readonly _accountRepository: AccountRepository

  constructor (accountRepository: AccountRepository) {
    this._accountRepository = accountRepository
  }

  /**
   * Return account by account
   * @param account {number}
   * @returns {Account | null}
   */
  async run (account: number, entityId: string): Promise<Account | null> {
    const accountDb = await this._accountRepository.getByAccount(account, entityId)
    return accountDb
  }
}
