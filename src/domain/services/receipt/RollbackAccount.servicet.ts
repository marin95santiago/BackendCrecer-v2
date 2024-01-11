import { DoesNotExistException } from '../../exceptions/common/DoesNotExist.exception'
import { Account } from '../../entities/Account.entity'
import { AccountRepository } from '../../repositories/Account.repository'

export class RollbackAccountService {
  private readonly _accountRepository: AccountRepository

  constructor (accountRepository: AccountRepository) {
    this._accountRepository = accountRepository
  }

  /**
   * Return receipt or null
   * @param account account code
   * @returns { Account }
   */
  async run (entityId: string, accountCode: number, value: number): Promise<Account | null> {
    const account = await this._accountRepository.getByAccount(accountCode, entityId)
    if (!account) throw new DoesNotExistException('Account')

    account.balance = account.balance - value

    return this._accountRepository.update(account)
  }
}
