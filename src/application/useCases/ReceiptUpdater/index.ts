import { Receipt } from '../../../domain/entities/Receipt.entity'
import { ReceiptRepository } from '../../../domain/repositories/Receipt.repository'
import { GetReceiptByCodeService } from '../../../domain/services/receipt/GetReceiptByCode.service'
import { DoesNotExistException } from '../../../domain/exceptions/common/DoesNotExist.exception'
import { MissingPropertyException } from '../../../domain/exceptions/common/MissingProperty.exception'
import { UpdateAccountBalanceByReceiptUpdatedService } from '../../../domain/services/receipt/UpdateAccountBalanceByReceiptUpdated.service'
import { RollbackAccountService } from '../../../domain/services/receipt/RollbackAccount.servicet'
import { AccountRepository } from '../../../domain/repositories/Account.repository'

export class ReceiptUpdaterUseCase {
  private readonly _receiptRepository: ReceiptRepository
  private readonly _getReceiptByCode: GetReceiptByCodeService
  private readonly _updateAccountBalanceByReceiptUpdatedService: UpdateAccountBalanceByReceiptUpdatedService
  private readonly _rollbackAccountService: RollbackAccountService

  constructor(receiptRepository: ReceiptRepository, accountRepository: AccountRepository) {
    this._receiptRepository = receiptRepository
    this._getReceiptByCode = new GetReceiptByCodeService(receiptRepository)
    this._updateAccountBalanceByReceiptUpdatedService = new UpdateAccountBalanceByReceiptUpdatedService(accountRepository)
    this._rollbackAccountService = new RollbackAccountService(accountRepository)
  }

  async run (body: Receipt): Promise<Receipt> {
    if (body.code === undefined || body.code === '') throw new MissingPropertyException('code')
    if (body.date === undefined || body.date === '') throw new MissingPropertyException('date')
    if (body.description === undefined || body.description === '') throw new MissingPropertyException('description')
    if (body.thirdDocument === undefined || body.thirdDocument === '') throw new MissingPropertyException('thirdDocument')
    if (body.totalValueLetter === undefined || body.totalValueLetter === '') throw new MissingPropertyException('totalValueLetter')
    if (body.total === undefined) throw new MissingPropertyException('total')
    if (body.accounts === undefined || body.accounts.length === 0) throw new MissingPropertyException('accounts')
    if (body.concepts === undefined || body.concepts.length === 0) throw new MissingPropertyException('concepts')

    const receipt = await this._getReceiptByCode.run(body.entityId, body.code)
    if (!receipt) throw new DoesNotExistException('Receipt')

    const promisesAccount = body.accounts.map(newAccount => {
      // Find account in old accounts
      const oldAccount = receipt.accounts.find(account => account.account === newAccount.account)

      if (oldAccount && oldAccount.value !== newAccount.value) {
        return this._updateAccountBalanceByReceiptUpdatedService.run(body.entityId, newAccount.account, oldAccount.value, newAccount.value)
      }

      if (!oldAccount) {
        return this._updateAccountBalanceByReceiptUpdatedService.run(body.entityId, newAccount.account, 0, newAccount.value)
      }
    })

    const promisesToRollbackAccount = receipt.accounts.map(oldAccount => {
      const exist = body.accounts.some(newAccount => newAccount.account === oldAccount.account)
      if (!exist) {
        return this._rollbackAccountService.run(body.entityId, oldAccount.account, oldAccount.value)
      }
    })
    
    const promises = [
      ...promisesAccount.concat(promisesToRollbackAccount),
      this._receiptRepository.update(body)
    ]

    await Promise.all(promises)

    return body
  }
}
