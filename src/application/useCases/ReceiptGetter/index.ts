import { Receipt } from '../../../domain/entities/Receipt.entity'
import { ReceiptRepository } from '../../../domain/repositories/Receipt.repository'

export class ReceiptGetterUseCase {
  private readonly _receiptRepository: ReceiptRepository

  constructor (receiptRepository: ReceiptRepository) {
    this._receiptRepository = receiptRepository
  }

  async run (entityId: string, limit?: number, lastEvaluatedKey?: any): Promise<{ lastEvaluatedKey: any, receipts: Receipt[] }> {
    const response: { lastEvaluatedKey: any, receipts: Receipt[] } = await this._receiptRepository.getAll(entityId, limit, lastEvaluatedKey)
    return response
  }
}
