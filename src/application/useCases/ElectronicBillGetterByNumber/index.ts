import { ElectronicBill } from '../../../domain/entities/ElectronicBill.entity'
import { ElectronicBillRepository } from '../../../domain/repositories/ElectronicBill.repository'

export class ElectronicBillGetterByNumberUseCase {
  private readonly _electronicBillRepository: ElectronicBillRepository

  constructor (electronicBillRepository: ElectronicBillRepository) {
    this._electronicBillRepository = electronicBillRepository
  }

  /**
   * Return bill by number
   * @param number {number}
   * @returns {ElectronicBill | null}
   */
  async run (entityId: string, number: number): Promise<ElectronicBill | null> {
    const bill = await this._electronicBillRepository.getByNumber(entityId, number)
    return bill
  }
}
