import { Account } from '../../../domain/entities/Account.entity'
import { AccountRepository } from '../../../domain/repositories/Account.repository'
import { ExistAccountByAccountService } from '../../../domain/services/account/ExistAccountByAccount.service'
import { DoesNotExistException } from '../../../domain/exceptions/common/DoesNotExist.exception'
import { MissingPropertyException } from '../../../domain/exceptions/common/MissingProperty.exception'

export class AccountUpdaterUseCase {
  private readonly _accountRepository: AccountRepository
  private readonly _existAccountByAccount: ExistAccountByAccountService

  constructor(accountRepository: AccountRepository) {
    this._accountRepository = accountRepository
    this._existAccountByAccount = new ExistAccountByAccountService(accountRepository)
  }

  async run (body: Account): Promise<Account> {
    if (body.account === undefined || body.account === 0) throw new MissingPropertyException('account')
    if (body.description === undefined || body.description === '') throw new MissingPropertyException('description')

    const existItem: boolean = await this._existAccountByAccount.run(body.account, body.entityId)
    if (!existItem) throw new DoesNotExistException('Account')

    await this._accountRepository.update(body)

    return body
  }
}
