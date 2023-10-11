import { AccountRepository } from '../../repositories/Account.repository'
import { Account } from 'domain/entities/Account.entity'

export class GetAccountByAccountService {
  private readonly _accountRepository: AccountRepository

  constructor (accountRepository: AccountRepository) {
    this._accountRepository = accountRepository
  }

  /**
   * Return true or false if account already exist
   * @param account {number}
   * @returns {boolean} true or false
   */
  async run (account: number, entityId: string): Promise<Account | null> {
    const item = await this._accountRepository.getByAccount(account, entityId)

    // exist return true
    return item
  }
}
