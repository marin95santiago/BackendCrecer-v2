import { Receipt } from '../../entities/Receipt.entity'
import { ReceiptRepository } from '../../repositories/Receipt.repository'

export class GetReceiptByCodeService {
  private readonly _receiptRepository: ReceiptRepository

  constructor (receiptRepository: ReceiptRepository) {
    this._receiptRepository = receiptRepository
  }

  /**
   * Return receipt or null
   * @param code {string}
   * @returns { Receipt }
   */
  async run (entityId: string, code: string): Promise<Receipt | null> {
    const receipt = await this._receiptRepository.getByCode(entityId, code)

    return receipt
  }
}
