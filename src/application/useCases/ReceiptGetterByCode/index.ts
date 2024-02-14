import { Receipt } from '../../../domain/entities/Receipt.entity'
import { ReceiptRepository } from '../../../domain/repositories/Receipt.repository'

export class ReceiptGetterByCodeUseCase {
  private readonly _receiptRepository: ReceiptRepository

  constructor (receiptRepository: ReceiptRepository) {
    this._receiptRepository = receiptRepository
  }

  /**
   * Return receipt by code
   * @param code {string}
   * @returns {Receipt | null}
   */
  async run (code: string, entityId: string): Promise<Receipt | null> {
    const receipt = await this._receiptRepository.getByCode(entityId, code)
    return receipt
  }
}
