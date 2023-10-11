import { Receipt } from 'domain/entities/Receipt.entity'

export interface ReceiptRepository {
  getAll: (entityId: string, limit?: number, lastEvaluatedKey?: any) => Promise<{lastEvaluatedKey: any, receipts: Receipt[]}>
  save: (receipt: Receipt) => Promise<Receipt>
  getByCode: (code: string, entityId: string) => Promise<Receipt | null>
}
