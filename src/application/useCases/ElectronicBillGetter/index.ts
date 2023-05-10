import { ElectronicBill } from '../../../domain/entities/ElectronicBill.entity'
import { ElectronicBillRepository } from '../../../domain/repositories/ElectronicBill.repository'

export class ElectronicBillGetterUseCase {
  private readonly _electronicBillRepository: ElectronicBillRepository

  constructor (electronicBillRepository: ElectronicBillRepository) {
    this._electronicBillRepository = electronicBillRepository
  }

  async run (entityId: string, limit?: number, lastEvaluatedKey?: any): Promise<{ lastEvaluatedKey: any, bills: ElectronicBill[] }> {
    const response: { lastEvaluatedKey: any, bills: ElectronicBill[] } = await this._electronicBillRepository.getAll(entityId, limit, lastEvaluatedKey)
    return response
  }
}
