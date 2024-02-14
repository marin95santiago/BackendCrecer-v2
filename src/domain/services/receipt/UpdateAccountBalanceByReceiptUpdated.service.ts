import { DoesNotExistException } from '../../exceptions/common/DoesNotExist.exception'
import { Account } from '../../entities/Account.entity'
import { AccountRepository } from '../../repositories/Account.repository'

export class UpdateAccountBalanceByReceiptUpdatedService {
  private readonly _accountRepository: AccountRepository

  constructor (accountRepository: AccountRepository) {
    this._accountRepository = accountRepository
  }

  /**
   * Return receipt or null
   * @param account account code
   * @returns { Account }
   */
  async run (entityId: string, accountCode: number, valueToRoolback: number, newValue: number): Promise<Account | null> {
    const account = await this._accountRepository.getByAccount(accountCode, entityId)
    if (!account) throw new DoesNotExistException('Account')

    // Rollback value
    account.balance = account.balance - valueToRoolback
    // Add new value
    account.balance = account.balance + newValue

    return this._accountRepository.update(account)
  }
}
