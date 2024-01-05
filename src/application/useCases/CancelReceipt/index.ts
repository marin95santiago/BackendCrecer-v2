import { Receipt } from '../../../domain/entities/Receipt.entity'
import { ReceiptRepository } from '../../../domain/repositories/Receipt.repository'
import { GetReceiptByCodeService } from '../../../domain/services/receipt/GetReceiptByCode.service'
import { DoesNotExistException } from '../../../domain/exceptions/common/DoesNotExist.exception'
import { RollbackAccountService } from '../../../domain/services/receipt/RollbackAccount.servicet'
import { AccountRepository } from '../../../domain/repositories/Account.repository'

export class CancelReceiptUseCase {
  private readonly _receiptRepository: ReceiptRepository
  private readonly _getReceiptByCode: GetReceiptByCodeService
  private readonly _rollbackAccountService: RollbackAccountService

  constructor(receiptRepository: ReceiptRepository, accountRepository: AccountRepository) {
    this._receiptRepository = receiptRepository
    this._getReceiptByCode = new GetReceiptByCodeService(receiptRepository)
    this._rollbackAccountService = new RollbackAccountService(accountRepository)
  }

  async run (entityId: string, code: string): Promise<Receipt> {
    const receipt = await this._getReceiptByCode.run(entityId, code)
    if (!receipt) throw new DoesNotExistException('Receipt')

    receipt.status = 'NULL'

    const promisesAccount = receipt.accounts.map(acc => {
      return this._rollbackAccountService.run(entityId, acc.account, acc.value)
    })

    const promises = [
      ...promisesAccount,
      this._receiptRepository.update(receipt)
    ]

    await Promise.all(promises)

    return receipt
  }
}
