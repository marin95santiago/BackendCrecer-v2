import { Account } from '../../../domain/entities/Account.entity'
import { AccountRepository } from '../../../domain/repositories/Account.repository'
import { ExistAccountByAccountService } from '../../../domain/services/account/ExistAccountByAccount.service'
import { AlreadyExistException } from '../../../domain/exceptions/common/AlreadyExist.exception'
import { MissingPropertyException } from '../../../domain/exceptions/common/MissingProperty.exception'

export class AccountCreatorUseCase {
  private readonly _accountRepository: AccountRepository
  private readonly _existAccountByAccount: ExistAccountByAccountService

  constructor(accountRepository: AccountRepository) {
    this._accountRepository = accountRepository
    this._existAccountByAccount = new ExistAccountByAccountService(accountRepository)
  }

  async run (body: Account): Promise<Account> {
    if (body.account === undefined || body.account === 0) throw new MissingPropertyException('account')
    if (body.description === undefined || body.description === '') throw new MissingPropertyException('description')
    if (body.document === undefined || body.document === 0) throw new MissingPropertyException('document')

    const existItem: boolean = await this._existAccountByAccount.run(Number(body.account), body.entityId)
    if (existItem) throw new AlreadyExistException('Account')

    await this._accountRepository.save(body)

    return body
  }
}
