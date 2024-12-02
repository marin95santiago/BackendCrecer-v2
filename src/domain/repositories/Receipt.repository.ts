import { Receipt } from 'domain/entities/Receipt.entity'

export interface ReceiptRepository {
  getAll: (entityId: string, limit?: number, lastEvaluatedKey?: any) => Promise<{lastEvaluatedKey: any, receipts: Receipt[]}>
  save: (receipt: Receipt) => Promise<Receipt>
  getByCode: (entityId: string, code: string) => Promise<Receipt | null>
  getByDateForDailyReport: (entityId: string, date: string, limit?: number, lastEvaluatedKey?: any) => Promise<{lastEvaluatedKey: any, receipts: any[]}>
  getByDateForExport: (entityId: string, startDate: string, endDate: string, limit?: number, lastEvaluatedKey?: any) => Promise<{lastEvaluatedKey: any, receipts: Receipt[]}>
  update: (receipt: Receipt) => Promise<Receipt>
}
