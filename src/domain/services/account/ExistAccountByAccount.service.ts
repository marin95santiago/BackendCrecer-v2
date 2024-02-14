import { AccountRepository } from '../../repositories/Account.repository'

export class ExistAccountByAccountService {
  private readonly _accountRepository: AccountRepository

  constructor (accountRepository: AccountRepository) {
    this._accountRepository = accountRepository
  }

  /**
   * Return true or false if account already exist
   * @param account {number}
   * @returns {boolean} true or false
   */
  async run (account: number, entityId: string): Promise<boolean> {
    const item = await this._accountRepository.getByAccount(account, entityId)

    // exist return true
    if (item !== null) return true

    return false
  }
}
