import { TransferBetweenAccount } from '../../../domain/entities/TransferBetweenAccount.entity'
import { TransferBetweenAccountRepository } from '../../../domain/repositories/TransferBetweenAccount.repository'
import { MissingPropertyException } from '../../../domain/exceptions/common/MissingProperty.exception'
import { AccountRepository } from '../../../domain/repositories/Account.repository'

export class TransferBetweenAccountUseCase {
  private readonly _transferBetweenAccountRepository: TransferBetweenAccountRepository
  private readonly _accountRepository: AccountRepository

  constructor(transferBetweenAccountRepository: TransferBetweenAccountRepository, accountRepository: AccountRepository) {
    this._transferBetweenAccountRepository = transferBetweenAccountRepository
    this._accountRepository = accountRepository
  }

  async run (body: TransferBetweenAccount): Promise<TransferBetweenAccount> {
    if (body.date === undefined || body.date === '') throw new MissingPropertyException('date')
    if (body.code === undefined || body.code === '') throw new MissingPropertyException('code')
    if (body.total === undefined || body.total === 0) throw new MissingPropertyException('total')
    if (body.sourceAccount === undefined || body.sourceAccount === 0) throw new MissingPropertyException('sourceAccount')
    if (body.destinationAccount === undefined || body.destinationAccount === 0) throw new MissingPropertyException('destinationAccount')
    if (body.status === undefined || body.status === '') body.status = 'VALID'

    const sourceAccount = await this._accountRepository.getByAccount(body.sourceAccount, body.entityId)
    const destinationAccount = await this._accountRepository.getByAccount(body.destinationAccount, body.entityId)

    if (sourceAccount && destinationAccount) {
      sourceAccount.balance = sourceAccount.balance - body.total
      destinationAccount.balance = destinationAccount.balance + body.total

      const promises = [
        this._accountRepository.update(sourceAccount),
        this._accountRepository.update(destinationAccount),
        this._transferBetweenAccountRepository.save(body)
      ]

      await Promise.all(promises)
    }

    return body
  }
}
